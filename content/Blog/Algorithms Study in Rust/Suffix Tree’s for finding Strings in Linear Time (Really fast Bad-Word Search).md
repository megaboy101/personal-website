---
Owner: Jacob Bleser
Created time: 2023-08-17T12:13
Development: Budding
Lifespan: Evergreen
Type: Guide
---
  
# Problem statement
Today is your first day on a content moderation team!

Your first job is to build a content filter so that people who write phrases with bad words are automatically censored.

For example the phrase,
`You are a stupid person`
Would be censored to read as:
`You are a ****** person`

Additionally, we want to be diligent and also take care of leetspeak variations of words:

So the phrase,
`You are a $tup!d person`
Would still become:
`You are a ****** person`
  
We have here a list of bad words we would like to censor:
![[bad-words.txt]]
  
Along with a list of leetspeak variations for various letters:
![[leetspeak.csv]]
  
# Explanation
All the code to solve this will be done in Python, but should be generally applicable to any language
  
## Program Setup
I’m going to solve this from the outside in, first setting up the general program, and then honing in on the more complex parts.
  
First, we need to add some plumbing code for loading in our data:
```python
def load_bad_words() -> list[str]:
    with open('bad_words.txt') as f:
        return [ line for line in f ]

def load_leetspeak() -> dict[str, list[str]]:
    with open('leetspeak.csv') as f:
        reader = csv.reader(f)
        aliases = {}
        for row in reader:
            char, *aliases = row
            aliases[char] = aliases
        return aliases

def tweet_stream() -> Iterable[str]:
    with open('tweets.csv') as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield row['tweet']
```
  
The above code will load each of our needed files into a format we can work with
Note that the tweets list is extremely large (~200MB). This is a lot of data to load into RAM all at once, so instead of loading the entire file at once and keeping it in RAM, we just want to read one line at a time. That’s why we are using `yield` instead of the usual `return`
  
## Scaffolding our Algorithm
So to solve this problem there are 2 primary operations we need to do:
1. Our censoring algorithm changes words, but we are given phrases. So we need a function that can _deconstruct_ a phrase into a list of words we can work with, and then _reconstruct_ our words back into a phrase
2. Given a word, we need to know if it is bad. We already know what words are bad ahead of time, so what we need to build is a function that can _search_ our bad word list. We can then use the search result to determine if we should censor the word
  
  
### Building a phrase censoring pipeline
  
We will first add our main function, which will load our bad words, and run our censoring logic:
```python
def main():
    bad_words = load_bad_words()
    leetspeak = load_leetspeak()
    bad_word_set = BadWordSet(bad_words, leetspeak)
    tweets = tweet_stream()
		
		# Load censor a single tweet.
    tweet = next(tweets)
		censored_tweet = censor(tweet, bad_word_set)
		
		# Print the result
		print(censored_tweet)
if __name__ == "__main__":
	  main()
```
  
Our main function does the following:
- Loads our list base bad words and leetspeak aliases
- Builds a complete set of bad words accounting for aliases (more on this later).
    - Note that, because we know all our bad words ahead of time, we can load them into our program all at once before we start censoring words, rather than needing to load our bad word list each time we want to censor a word.
- Loads and censors a single tweet
- Prints the censored tweet to our terminal
  
### Censoring Phases
  
With our driving code in place, we can now construct a function that will censor a given phrase:
```python
class BadWordSet:
    pass

def censor_word(word: str, bad_words: BadWordSet) -> str:
    if word in bad_words:
        return '*' * len(word)
    else:
        return word

def censor(phrase: str, bad_words: BadWordSet) -> str:
    words = phrase.split(" ")
    censored_words = map(censor_word, words)
    censored_phrase = " ".join(censored_words)
    return censored_phrase
```
  
The above functions should hopefully be self-explanatory. We define a censor function that breaks a given phrase into a list of individual words, using the space symbol to know when one word ends and the next begins, censors each individual word, and then rebuilds the phrase from the list of words.
  
So for example, the phrase:
`"You are stupid"`
  
Would be split into a list like so:
`[”You”, “are”, “stupid”]`
  
Then censored:
`[”You”, “are”, “******”]`
  
And lastly rebuilt:
`You are ******`
  
Note, this logic isn’t perfect, as it’s very possible words could be split with more than just spaces. Take for example the phrase:
`You are: Stupid` → `[”You”, “are: Stupid”]`
But this logic should be enough to parse a majority of words for now.
  
Lastly, our `censor_word` function just checks if our word is in our list of bad words, and if so, replaces all of its characters with asterisks.
  
# Word Search Done Quick
With our censoring logic in place, we now come to the crux of our algorithm: Really Fast Word Search
  
We need to build a data structure that will be able to tell us if a given word is in our list of bad words as quickly as possible
  
Below is a list of approaches, followed by a summary of their memory and CPU tradeoffs.
  
## Attempt \#1: List
  
The first data structure we could try is a list.
A list stores all of its data linearly in memory.
This means that to know if a word is in our list of bad words, we need to check each word one-by-one until we find a match.
  
Here is how we could build a list of all bad words we need to watch out for:
```python
class BadWords:
    def __init__(self, bad_words: list[str], leetspeak: dict[str, list[str]]):
        self.words = self._variadic_words(bad_words, leetspeak)
    # This method allows us to use the `in` keyword on our class
    def __contains__(self, word: str):
        return word in self.words
    def _variadic_words(self, bad_words: list[str], leetspeak: dict[str, list[str]]):
        # First we define a leetspeak lookup dictionary.
        # This means that given a base character, you can find all variations
        # s -> [5, $, S, s]
        leetspeak_lookup = { key.lower():[*val, key.lower(), key.upper()] for key, val in leetspeak.items() }
        # Next we define a base lookup dictionary.
        # This means that given any leetspeak character, you can find what base
        # character it refers to.
        # $ -> s
        base_lookup = {}
        for base, variations in leetspeak.items():
            for variation in variations:
                base_lookup[variation] = base.lower()
            # We also define upper and lower case variations of a base char
            base_lookup[base.lower()] = base.lower()
            base_lookup[base.upper()] = base.lower()
        # Now we precompute all possible variations of all bad words, and store it in our list
        variadic_words = []
        for word in bad_words:
            for variation in self._variations_for_word(word, leetspeak_lookup, base_lookup):
                variadic_words.append(variation)
        
        return variadic_words

    def _variations_for_word(self, word: str, leetspeak_lookup: dict, base_lookup: dict) -> list[str]:
        """
        This function generates all leetspeak variations of a single word.
        For example:
        hi -> [hi, h!, h1, \#i, #!, \#1]
        """
        variadic_chars = []
        for char in word.lower():
            base = base_lookup[char]
            variations = leetspeak_lookup[base]
            variadic_chars.append(tuple(variations))
        
        return [ ''.join(variation) for variation in itertools.product(*variadic_chars) ]
```
  
This is a lot of complicated code, so I’ll break it down step-by-step:
- When initialized, we call `self._variadic_words(bad_words, leetspeak)`. This is a function that will convert a list of strings into another list that contains all leetspeak variations of all words.
- We build all possible leetspeak bad-words immediately so that we can cache it for all future searches. If we were to search the term `stupid` 20 times, we now don’t need to build all leetspeak variations of `stupid` 20 times as well.
- To build the leetspeak variations, we need 2 things:
    1. A way to figure out what the base of a given character is
    2. A way to figure out what all the leetspeak versions of a character is
- We use 2 dicts to make looking this data up very quick and relatively memory efficient
- The crux of our variation generation logic is in `_variations_for_word()`.
    - First we split a word into a list of characters. We then map each character to a list of all the leetspeak variations of each character.
        - `“h!”` → `[”h”, “!”]` → `[[”h”, “#”], [”i”, “!”, “1”]]`
    - With this data in hand we use `itertools.product()` to get the cartesian product of our characters
        
        - This function can be thought of as a very deeply-nested for loop. In this example it would look like this:
        
        ```bash
        for h_char in ["h", "#"]:
        	for i_char in ["i", "!", "1"]:
        		print(h_char + i_char)
        # hi, h!, h1, \#i, #!, \#1
        ```
        
        - But itertools.product() can nest arbitrarily deep, take for example the word pig:
        
        ```bash
        for p_char in ["p"]:
        	for i_char in ["i", "!", "1"]:
        		for g_char in ["g", "9"]:
        			print(p_char + i_char + g_char)
        # pig, pi9, p!g p!9, p1g, p19
        ```
        
  
As you can probably imagine, the number of variations for each word can quickly get quite massive, leading to a lot of time spent generating them before we are ready to start processing characters.
Again the advantage of this though is that we can _precompute_ every bad variation of every bad word ahead of time, resulting in much faster search times in the long run.
  
We can now time our program to see how our data structure performs in practice:
```bash
[BadWordList] Using [4] bad words
[BadWordList] Generated [5742] total bad words
[Building bad word dictionary] Time Elapsed: 0.0009670257568359375
[999] tweets scanned
[16] tweets censored
[Censoring bad words] Time Elapsed: 0.5206742286682129
```
As you can see, we spent ~1ms building our dictionary of 4 bad words.
Note how even with just 4 bad words, we already have over 5 thousand variations!
It then took ~0.5sec to scan and censor 999 tweets, with a 1.6% censor rate. This is because the majority of tweets will not contain profanity (thankfully)
  
Now that we have a base implementation in hand we can being thinking of ways to optimize our searching algorithm.
  
## Attempt \#2: Set
Currently when we want to test if a word is bad, we need to look through our bad-word list one-by-one until a match is found. This has a few notable deficiencies:
1. In the worst case where a word is not bad, we will have to do a string comparison on every word in our bad word list, resulting in O(n) search performance
2. The worst case runtime is extremely common, since, as we saw, the vast majority of words aren’t bad. This mean’s almost all of our scans are wasted time
3. Our bad word list is huge and unsorted, meaning most bad words will be found somewhere randomly in the list
  
The best optimization we could make is to eliminate the need to scan the entire list whenever possible.
  
This is an ideal use case for a set!
  
I won’t go into the nitty gritty details of how to make a set data structure in this article since Python already has one built-in for us to use.
All you need to know about a set is the following:
- A set is similar to a list in that it is a collection of items
- A set cannot be sorted
- A set can tell you if it contains a given item in O(1) time.
  
This last property of a set is what we’re interested in. If we store all our bad words in a set, we can learn in O(1) time if the word is bad, _even when it isn’t_
  
### Building a BadWordSet
Here is the code for our bad word set:
```python
class BadWordSet:
    def __init__(self, bad_words: list[str], leetspeak: dict[str, list[str]]):
        print(f"[BadWordList] Using [{len(bad_words)}] bad words")
        self.words = set(self._variadic_words(bad_words, leetspeak))
        print(f"[BadWordList] Generated [{len(self.words)}] total bad words")
    # This method allows us to use the `in` keyword on our class
    def __contains__(self, word: str):
        return word in self.words
    def _variadic_words(self, bad_words: list[str], leetspeak: dict[str, list[str]]):
        # First we define a leetspeak lookup dictionary.
        # This means that given a base character, you can find all variations
        # s -> [5, $, S, s]
        leetspeak_lookup = { key.lower():[*val, key.lower(), key.upper()] for key, val in leetspeak.items() }
        # Next we define a base lookup dictionary.
        # This means that given any leetspeak character, you can find what base
        # character it refers to.
        # $ -> s
        base_lookup = {}
        for base, variations in leetspeak.items():
            for variation in variations:
                base_lookup[variation] = base.lower()
            # We also define upper and lower case variations of a base char
            base_lookup[base.lower()] = base.lower()
            base_lookup[base.upper()] = base.lower()
        # Now we precompute all possible variations of all bad words, and store it in our list
        variadic_words = []
        for word in bad_words:
            for variation in self._variations_for_word(word, leetspeak_lookup, base_lookup):
                variadic_words.append(variation)
        return variadic_words

    def _variations_for_word(self, word: str, leetspeak_lookup: dict, base_lookup: dict) -> list[str]:
        """
        This function generates all leetspeak variations of a single word.
        For example:
        hi -> [hi, h!, h1, \#i, #!, \#1]
        """
        variadic_chars = []
        for char in word.lower():
            base = base_lookup[char]
            variations = leetspeak_lookup[base]
            variadic_chars.append(tuple(variations))
        
        return [ ''.join(variation) for variation in itertools.product(*variadic_chars) ]
```
  
The code above is almost identical to our `BadWordList` implementation. The only difference is now we are setting self.words as a set instead of a list.
  
Lets try running this now and see how it performs:
```bash
[BadWordList] Using [4] bad words
[BadWordList] Generated [5742] total bad words
[Building bad word dictionary] Time Elapsed: 0.0012862682342529297
[999] tweets scanned
[16] tweets censored
[Censoring bad words] Time Elapsed: 0.005179166793823242
```
```python
[BadWordList] Using [4] bad words
[BadWordList] Generated [3870] total bad words
[Building bad word dictionary] Time Elapsed: 0.0007929801940917969
[10000] tweets scanned
[126] tweets censored
[Censoring bad words] Time Elapsed: 0.0453031063079834
```
  
Here’s our results:
- It took a little bit longer to build our bad word dictionary. This is most likely the time spent building a set from our bad word list
- The time spent censoring words went WAY down. It now takes only ~5ms to censor our list, which is 100x improvement!
  
  
But, we can go even further beyond!
  
## Attempt \#3: Trie
With our previous example, we effectively reduced our bad-word search time to O(1).
But there are still a couple deficiencies we may be able to optimize:
1. In order to search our set, our word needs to be hashed into a number representing it’s index in a list. Technically this hashing process takes O(1) time to perform, but in practice it still takes a non-zero amount of time to compute. If we can scan our list in a shorter amount of time than the time it takes to hash a word, we should see a performance improvement
2. We have to do a significant amount of precomputing, and our precomputed dataset is HUGE. Again this technically can be done ahead of time, effectively reducing the actual search time we are measuring. But if we can reduce the storage or processing time for the precomputing step, we will have a much more usable algorithm in practice.
  
To address both the deficiencies, we are going to leverage a more niche data structure known as a Trie.
  
### An Aside on Trie’s
Trie’s, pronounced like “Try”, are a tree-like data structure for efficiently storing and searching lists of strings.
  
The best way to understand what a Trie is and how it functions is to see an example:
![[Sketchbook/img/Untitled.png|Untitled.png]]
  
As illustrated above, a Trie works like so:
- A Trie is a tree where each edge (not node!) represents a character
- Each node in a Trie can have an arbitrary number of children.
- A string is added to a Trie by adding an edge for each character in the the string
    - So for example, pig: p → i → g END
- When an additional string is added to the Trie, we follow the edges of existing characters first, and then only add new nodes when we have to
  
Because a Trie shares characters from the root, it is also sometimes called a Prefix Tree
  
A Trie has the following performance characteristics:
- Each node in a Trie can only contain as many children as the number of characters have across all your words. This means it’s search performance is not $O(\log_2 n)$﻿ like a binary tree for example, but actually $O(\log_c n)$﻿, where c is the number of characters. For a standard a-z alphabet, this translates to $O(\log_{26} n)$﻿.
- Unlike a set, searching a Trie for a string does not require a hashing step, but rather a series of character comparisons. In theory this should be much quicker, but remember to always test and verify in the real world!
- A Trie uses much less space than a typical list or set, since many characters are re-used. Different Trie implementation (such as a Radix Trie) can improve the real-world space requirements even further
  
### Building a BadWordTrie:
What’s excellent about this implementation is that we don’t need to pre-compute all variations of our bad-word list ahead of time, which is impossible for long lists of bad words.
  
The only downside to this is that we need to do an additional set lookup for characters with aliases, but this is extremely minor in practice it looks like
  
Performance:
```bash
[BadWordTrie] Using [4] bad words
[BadWordTrie] Generated Trie
[Building bad word dictionary] Time Elapsed: 0.002708911895751953
[999] tweets scanned
[16] tweets censored
[Censoring bad words] Time Elapsed: 0.0063381195068359375
```
```bash
[BadWordTrie] Using [4] bad words
[BadWordTrie] Generated Trie
[Building bad word dictionary] Time Elapsed: 0.002766847610473633
[10000] tweets scanned
[126] tweets censored
[Censoring bad words] Time Elapsed: 0.05200982093811035
```
```bash
[BadWordTrie] Using [34] bad words
[BadWordTrie] Generated Trie
[Building bad word dictionary] Time Elapsed: 5.793571472167969e-05
[10000] tweets scanned
[120] tweets censored
[Censoring bad words] Time Elapsed: 0.05945992469787598
```
  
This may actually be the limit for what I should be expected to implement. It’s just about as fast as a set, but whereas a set requires storing all keys ahead of time (which we can generate quickly), our trie allows us to just need to store bases and we can efficiently sub in alterations at search time.
  
Originally I thought efficient searching was the absolute top requirement, and the challenge was to make a data structure that could be searched more quickly than a set. But I see now that the real challenge is efficient searching without being able to precompute a full dictionary ahead of time.
A trie is basically an excellent data structure for fuzzy text matching if you know what variations a word can have ahead of time.
Or for that matter, I think a trie is a good data structure for approximate string matching in general. Prefix matching for example in autocomplete is another good example.
  
One optimization I may be able to make is to leverage the fact that Trie’s can also prefix match any string. This may remove the need to split the string into chunks before analyzing it.
Thinking more on this, this may not be a good decision. If there is not splitting logic then it’s possible you could get false positives. For example, the term `flying buttress` would get flagged when it really shouldn’t be.
  
The only other challenge I could think of would be how to do intelligent string splitting. My current method just splits strings by spaces, but this isn’t necessarily foolproof.
I imagine this is something I would just ask about in the interview though. If it was a more complex pattern I could easily just come up with a regex pattern to do some more advanced splitting.
  
Ok this challenge may not be as off-base as first thought. Several string searching algorithms search text linearly without the need for initially splitting. I don’t think splitting is that intensive honestly. But, there are 2 cases in which I think it wouldn’t suffice.
1. The string we are checking is massive. In which case creating a split copy of the string may be too much overhead. Although you’d really need a ridiculously large string for that to be warranted, and even then I could just iterate through the string an manually split as I went
2. I was doing true text search. By that I mean we would want the term `flying buttress` to register. If that were the case, approximate string matching would not suffice, and we would need to fall back on linear text searching. The only approach I could think of for this would be to create a “naked” Trie. So we could have the same Trie as before, but this time we would give it a character, and it would tell us if we have a match as we go. So we would do a linear scan through the string, flagging bad words as we go.
    - This does have some weird defects though. Take the term `asstupid`. How would this even get flagged? As 0 words, 1, or 2? If it came to this I imagine we could just ask the instructor. But ya.
        - Maybe we could hella pointer it? Like for each character, we try start a Trie search, and try to continue all our existing matched strings? Ya I think this would work, and not be too bad.
  
Ya, I think this is the limit of the challenge.
  
# Additional Ideas
- What if I just did a regex search on each string?
    - This wouldn’t work because the pattern would basically just be the strings I want to match, which is just a set by another name