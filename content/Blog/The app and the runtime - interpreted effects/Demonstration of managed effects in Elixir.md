---
Owner: Jacob Bleser
Created time: 2023-06-01T12:53
Development: Seed
Lifespan: Seasonal
Type: Guide
---
## Overview
- Build modules around data structures! You want to think of your program as just algorithms and data structures
- Think of your application as one massive reducer that takes in the state of the world and your request as input, and outputs an updated state of the world
- You create a data structure to represent the state of the world
- Updating the state of the world can be handled by 1 all-encompassing module that takes the state and action and returns a new state, or more interestingly it can be split into contexts
- Each context defines a protocol for what its “slice” of the world needs to be able to do. The thinking is that by having each context require only the pieces it needs, the context modules become radically simpler, decoupled, and easier to test. It can also help you naturally figure out your service boundaries if you eventually build out additional services
- You then implement each contexts protocol for your state struct
- Effects are run in the protocol implementations. This means in testing you can create alternate implementations that run more manageable effects
- Protocol implementations are also the most tricky part to get right because they are effectful, and have to do some magic behind the scenes
  
## Future Explorations
- Generalize as much of this process as possible. Search for common patterns and abstract them out, but not too soon
    - Saving and message publishing could be abstracted away as a common action at the end of every function in the root, similar to how elm works. So the root function would return a {state, event} tuple. I’m not sure if I like the idea of requiring a specific return type in functions though. I suppose one idea is you could make the root module `$use$`﻿ something and act as like a “root reducer” of sorts, but I’m not sure if I like that either tbh.
- Figure out where/how post-save actions should be handled. This is pretty much always sending out async messages. It doesn’t fit the “save” idiom though
- There are some types of effects that don’t fit either the save or event abstraction. How should they be handled:
    - Sending an email or similar notification
        - In all honesty I think a good engineer would have this be done from an event since it’s async anyway, but I’m hesitant to force it, since sometimes you really do wanna wait for confirmation
    - Recording an analytic
        - Same as above, I think this should be handled async since its perceived async
    - Doing an ML inference
        - No idea what the protocol is on this one, so cant definitively say. Say for example you give a natural language prompt and want a response back.
  
  
## Example
Imagine the Checkmate App
We want to implement a feature to opt a profile into matching
  
Here is the implementation/architecture breakdown:
```elixir
## lib/checkmate_web/profile_controller.ex
defmodule CheckmateWeb.ProfileController do
	...controller logic...
	# Note the custom setup for injecting the app data structure into
	# the controller
	@spec opt_into_matching(Plug.Conn.t, Checkmate.t) :: Plug.Conn.t
	def opt_into_matching(conn, app) do
		with(
      :ok <- Checkmate.opt_profile_into_matching(app, conn.assigns[:profile_id])
    )
    do
			# Note, this uses the Phoenix 1.7 view syntax
      render(conn, :ok)
    end
	end
end
```
```elixir
## lib/checkmate.ex
defmodule Checkmate do
	require Logger
	alias Ecto.Multi
	
	# Effect handlers
	alias Checkmate.Repo
	alias Checkmate.Events
	# Contexts
	alias Checkmate.Matching

	# App state
	
	# Here we can define any fields we want to help us implement our context
	# protocols or the save protocol
	defstruct [
		multi: Multi.new()
	]
	
	# Public API
	@spec opt_profile_into_matching(t, String.t) :: :ok | {:error, :not_found | ...}
	def opt_profile_into_matching(app, profile_id) do
		Logger.info("opting profile into matching")
		# Here we do 3 things:
		# 1. Delegate logic to the context module responsible for this "slice"
		#    of application state. Notice how even though we pass in the entire
		#    application struct, the context module only perceives it as something
		#    implementing it's data protocol
		# 2. We give our updated application state to our repo module to save it.
		#    The repo is part of the application "runtime" that knows how to persist
		#    the app data structure. You can almost think of it as the first part of
		#    the update tuple in Elm
		# 3. The generate an event that can then be handled async in the background
		#    by some listener process. You can similarly think of it as the second
		#    part of the Elm tuple
		#
		# Note, we don't do any error handling or transformation here. Error tuples
		# follow a standard convention and will bubble up to be handled by the
		# controller handler
		with(
			{:ok, app} <- Matching.opt_in_profile(app, profile_id).
			{:ok, app} <- Repo.save(app),
			:ok <- Events.publish({:profile_opted_in, profile_id})
		)
		do
			:ok
		end
	end

	# Effect handlers
	#
	# Here we build the implementations for our contexts to use. These can be
	# defined across separate files if necessary to improve simplicity or testing
	# organization
	
	# The Save protocol enables us to persist our app state to whatever backing
	# service we want.
	defimpl Repo.Save do
		def save(app) do
			case Repo.transaction(app.multi) do
				{:ok, _} -> %Checkmate{ multi: Multi.new() }
				err -> err
			end
		end
	end
	# The Pool protocol enables us to match profiles
	defimpl Matching.Pool do
		alias Ecto.Changeset
		alias Checkmate.ResponseTable
		alias Checkmate.ProfileTable
		@profile_fields [:id, :match_status, :gender, :gender_preferences]
		def profiles(app, profile_id) do
			# Here we do a relatively complex query, but just of the data
			# we need of the matching. Notice how we don't fetch profile fields
			# we dont need
      response_query =
        from r in ResponseTable,
          # Only get the most recent response to each question
          # they have answered
          distinct: [r.question_id],
          order_by: [asc: r.question_id, desc: r.inserted_at],
          select: %{question_id: r.question_id, answer: r.answer}
      profile = Profile.get(profile_id, only: @profile_fields, include: [responses: response_query])
      # We convert the profile struct into a data structure we can dynamically change detect
      # without it being visible to the user.
      # Note, this is a bit of a hacky technique, and I'm not super-sold on it. It prevents
      # the consumer from being able to create a new profile map from scratch, all changes
      # to the map have to be done via update-syntax only. If you ever accidentally create
      # a new map, the entire structure crumbles
      profile
      |> Map.from_struct()
      |> Map.put_new(:__old_struct__, profile)
		end
		# Here we do some fancy change detection to update our ready-to-save
		# data. All updates are stored in an Ecto Multi as a way of collecting
		# changes-to-persist until they are ready to be "flushed"
		def set_profile(app, profile) do
			multi = app.multi
      old_profile = profile[:__old_struct__]
      updated_attrs = Map.delete(profile, :__old_struct__)
			profile_cs = ProfileTable.changeset(old_profile, updated_attrs)
			multi = ProfileTable.save(multi, profile_cs)
			multi =
				if Changeset.changed?(profile_cs, :cupid_id, from: nil) do
					Multi.run(multi, :cupid_create, fn _, %{profile: profile} ->
						case Cupid.set_person(profile) do
							:ok -> {:ok, nil}
							:error -> {:error, :cupid_save_failed}
						end
					end)
				else
					multi
				end
			
			%Checkmate{ app | multi: multi }
    end
	end
end
```
```elixir
## lib/checkmate/matching.ex
# This is our context module, responsible for managing all data in
# the matching "slice" of the state graph. It's important that this
# slice is mutually exclusive from all other contexts.
defmodule Checkmate.Matching do
	
	# Here we define some concrete data structures that we need.
	# Notice that the profile type is a Map, not a struct. This allows
	# us to leverage structural subtyping, where we can add any hidden
	# properties we want to the profiles our Pool implementation returns
	# without it spilling into the logic we define here
	@type gender :: :man | :woman | :nonbinary
  @type match_status :: :matched | :calculating | :not_enough_friends
  @type profile :: %{
    id: String.t,
    match_status: match_status,
    gender: gender,
    gender_preferences: [gender],
    min_match_age: non_neg_integer,
    max_match_age: non_neg_integer
  }
	
	# Here we define our root abstract data structure concerned with matching
	# Our app state will implement this protocol
	defprotocol Pool do
		alias Checkmate.Matching
		# This is a function to read data from the matching pool.
		# Notice how this is a function, not a property on some Pool struct
		# This is what enables us to fill in our own potentially effectful
		# way of getting the profile
		@spec profiles(t, String.t) :: Matching.profile | nil
	  def profiles(pool, profile_id)
		# This is a function to write data to the matching pool
		# Notice it always returns the same data type that goes in.
		# This gives the illusion that we're just updating a data structure
		@spec set_profile(t, Matching.profile) :: t
	  def set_profile(pool, profile)
	end
	# Here is our public API function
	# Note, all public functions should take their root data structure as the
	# first argument
	@spec opt_in_profile(Pool.t, String.t) :: {:ok, Pool.t} | {:error, :not_found | :already_opted_in | :opted_out_too_recently}
	def opt_in_profile(pool, profile_id) do
		# Here we just do some pure app logic. All state is kept in the protocol,
		# which allows us to manage it however we want in the implementation
		with(
      {:ok, profile} <- Pool.profiles(pool, profile_id) |> wrap(), # This is to convert the nil to an er/error tuple
      {:ok, profile} <- opt_in(profile)
    ) do
      Pool.set_profile(pool, profile)
    end
	end
	# This is a private function to do the real meat of the app logic we want
	# Notice how its pretty much just a pure data-in/data-out function. We even
	# do direct updates to the profile map
	#
	# The functions used here would be other private functions to aid profile
	# related app logic. This logic could also be put in a separate
	# Checkmate.Matching.Profile module as well if it becomes large or complex
	# enough. A separate module could also aid testing
	@spec opt_in(Pool.profile()) :: {:ok, Pool.profile()} | {:error, :already_opted_in | :opted_out_too_recently}
  defp opt_in(profile) do
    with(
      :ok <- validate_opt_inable(profile)
    ) do
      min..max = default_age_range(profile.birth_date)
      profile = %{ profile |
        match_status: status(profile),
        reject_requirement: length(profile.responses),
        min_match_age: min,
        max_match_age: max
      }
      {:ok, profile}
    end
  end
end
```