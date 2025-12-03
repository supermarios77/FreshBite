# Custom Sound Effects

Place your custom sound files here or in `/public/audio/`:

## Click Sound
The app will look for click sounds in this order:
1. `/sounds/click.mp3` (this directory)
2. `/audio/click.mp3`
3. `/audio/computer-mouse-click-351398.mp3` (existing file)

## Theme Switch Sound
The app will look for theme switch sounds in this order:
1. `/sounds/theme-switch.mp3` (this directory)
2. `/audio/theme-switch.mp3`
3. Falls back to click sound if theme-switch not found
4. Falls back to generated sound if no custom sounds available

## Supported Formats
- MP3 (recommended)
- WAV
- OGG

## File Naming
- `click.mp3` - Click sound effect
- `theme-switch.mp3` - Theme switch sound effect

## Fallback
If custom sound files are not found, the app will automatically use generated sounds via Web Audio API.

## Volume
Default volume is set to 50%. You can adjust this in `lib/utils/sound.ts` if needed.

## Usage
Just place your sound files in either:
- `/public/sounds/` (this directory)
- `/public/audio/` (alternative location)

The app will automatically detect and use them!

