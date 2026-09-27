# File jobs (ffmpeg recipes)

Needs `ffmpeg` (install once on the Mac with `brew install ffmpeg`).
Never write over anything in `footage/` — always output to a new file.

| Job | Command |
|-----|---------|
| Convert to MP4 (H.264) | `ffmpeg -i in.mov -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k out.mp4` |
| Crop/resize to 9:16 (1080×1920) | `ffmpeg -i in.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -c:a copy out.mp4` |
| Fit into 9:16 with black bars | `ffmpeg -i in.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:a copy out.mp4` |
| Compress (smaller file, still good) | `ffmpeg -i in.mp4 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k out.mp4` |
| Trim (start 00:05, 10 seconds long) | `ffmpeg -ss 00:00:05 -i in.mp4 -t 10 -c:v libx264 -crf 18 -c:a aac out.mp4` |
| Change to 30fps | `ffmpeg -i in.mp4 -r 30 -c:v libx264 -crf 18 -c:a copy out.mp4` |
| Strip audio | `ffmpeg -i in.mp4 -an -c:v copy out.mp4` |
| Grab a still frame (at 2s) | `ffmpeg -ss 2 -i in.mov -frames:v 1 still.png` |
| Check size/length/fps | `ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of default=nw=1 in.mp4` |

Tips: lower `-crf` = better quality/bigger file (18 ≈ visually lossless, 26 ≈ good for upload).
Re-encoding when trimming keeps cuts frame-accurate; `-c copy` is faster but snaps to keyframes.
