Upload Photography to Cloudflare:
```bash
# Copies the folder contents of SRC into the R2 photography bucket subfolder with the
# same name
# 
# Expects photos to be a flat folder, and SRC to be a valid slug
# 
# Uploading won't update the site immediately, due to being static
# A redeploy will be required
rclone copy {SRC} r2:photography/{SRC}
```
