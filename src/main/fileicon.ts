const fileiconContent =
  '#!/usr/bin/env bash\n' +
  '\n' +
  '###\n' +
  '# Home page: https://github.com/mklement0/fileicon\n' +
  '# Author:   Michael Klement <mklement0@gmail.com> (http://same2u.net)\n' +
  '# Invoke with:\n' +
  '#   --version for version information\n' +
  '#   --help for usage information\n' +
  '###\n' +
  '\n' +
  '# --- STANDARD SCRIPT-GLOBAL CONSTANTS\n' +
  '\n' +
  'kTHIS_NAME=${BASH_SOURCE##*/}\n' +
  "kTHIS_HOMEPAGE='https://github.com/mklement0/fileicon'\n" +
  "kTHIS_VERSION='v0.3.1' # NOTE: This assignment is automatically updated by `make version VER=<newVer>` - DO keep the 'v' prefix.\n" +
  '\n' +
  'unset CDPATH  # To prevent unpredictable `cd` behavior.\n' +
  '\n' +
  '# --- Begin: STANDARD HELPER FUNCTIONS\n' +
  '\n' +
  'die() { echo "$kTHIS_NAME: ERROR: ${1:-"ABORTING due to unexpected error."}" 1>&2; exit ${2:-1}; }\n' +
  'dieSyntax() { echo "$kTHIS_NAME: ARGUMENT ERROR: ${1:-"Invalid argument(s) specified."} Use -h for help." 1>&2; exit 2; }\n' +
  '\n' +
  '# SYNOPSIS\n' +
  '#   openUrl <url>\n' +
  '# DESCRIPTION\n' +
  "#   Opens the specified URL in the system's default browser.\n" +
  'openUrl() {\n' +
  '  local url=$1 platform=$(uname) cmd=()\n' +
  '  case $platform in\n' +
  "    'Darwin') # OSX\n" +
  '      cmd=( open "$url" )\n' +
  '      ;;\n' +
  "    'CYGWIN_'*) # Cygwin on Windows; must call cmd.exe with its `start` builtin\n" +
  '      cmd=( cmd.exe /c start \'\' "$url " )  # !! Note the required trailing space.\n' +
  '      ;;\n' +
  "    'MINGW32_'*) # MSYS or Git Bash on Windows; they come with a Unix `start` binary\n" +
  '      cmd=( start \'\' "$url" )\n' +
  '      ;;\n' +
  '    *) # Otherwise, assume a Freedesktop-compliant OS, which includes many Linux distros, PC-BSD, OpenSolaris, ...\n' +
  '      cmd=( xdg-open "$url" )\n' +
  '      ;;\n' +
  '  esac\n' +
  '  "${cmd[@]}" || { echo "Cannot locate or failed to open default browser; please go to \'$url\' manually." >&2; return 1; }\n' +
  '}\n' +
  '\n' +
  '# Prints the embedded Markdown-formatted man-page source to stdout.\n' +
  'printManPageSource() {\n' +
  "  /usr/bin/sed -n -e $'/^: <<\\'EOF_MAN_PAGE\\'/,/^EOF_MAN_PAGE/ { s///; t\\np;}' \"$BASH_SOURCE\"\n" +
  '}\n' +
  '\n' +
  '# Opens the man page, if installed; otherwise, tries to display the embedded Markdown-formatted man-page source; if all else fails: tries to display the man page online.\n' +
  'openManPage() {\n' +
  '  local pager embeddedText\n' +
  '  if ! man 1 "$kTHIS_NAME" 2>/dev/null; then\n' +
  '    # 2nd attempt: if present, display the embedded Markdown-formatted man-page source\n' +
  '    embeddedText=$(printManPageSource)\n' +
  '    if [[ -n $embeddedText ]]; then\n' +
  "      pager='more'\n" +
  "      command -v less &>/dev/null && pager='less' # see if the non-standard `less` is available, because it's preferable to the POSIX utility `more`\n" +
  '      printf \'%s\\n\' "$embeddedText" | "$pager"\n' +
  "    else # 3rd attempt: open the the man page on the utility's website\n" +
  '      openUrl "${kTHIS_HOMEPAGE}/doc/${kTHIS_NAME}.md"\n' +
  '    fi\n' +
  '  fi\n' +
  '}\n' +
  '\n' +
  '# Prints the contents of the synopsis chapter of the embedded Markdown-formatted man-page source for quick reference.\n' +
  'printUsage() {\n' +
  '  local embeddedText\n' +
  '  # Extract usage information from the SYNOPSIS chapter of the embedded Markdown-formatted man-page source.\n' +
  "  embeddedText=$(/usr/bin/sed -n -e $'/^: <<\\'EOF_MAN_PAGE\\'/,/^EOF_MAN_PAGE/!d; /^## SYNOPSIS$/,/^#/{ s///; t\\np; }' \"$BASH_SOURCE\")\n" +
  '  if [[ -n $embeddedText ]]; then\n' +
  '    # Print extracted synopsis chapter - remove backticks for uncluttered display.\n' +
  "    printf '%s\\n\\n' \"$embeddedText\" | tr -d '`'\n" +
  '  else # No SYNOPIS chapter found; fall back to displaying the man page.\n' +
  '    echo "WARNING: usage information not found; opening man page instead." >&2\n' +
  '    openManPage\n' +
  '  fi\n' +
  '}\n' +
  '\n' +
  '# --- End: STANDARD HELPER FUNCTIONS\n' +
  '\n' +
  '# ---  PROCESS STANDARD, OUTPUT-INFO-THEN-EXIT OPTIONS.\n' +
  'case $1 in\n' +
  '  --version)\n' +
  '    # Output version number and exit, if requested.\n' +
  '    ver="v0.3.1"; echo "$kTHIS_NAME $kTHIS_VERSION"$\'\\nFor license information and more, visit \'"$kTHIS_HOMEPAGE"; exit 0\n' +
  '    ;;\n' +
  '  -h|--help)\n' +
  '    # Print usage information and exit.\n' +
  '    printUsage; exit\n' +
  '    ;;\n' +
  '  --man)\n' +
  '    # Display the manual page and exit.\n' +
  '    openManPage; exit\n' +
  '    ;;\n' +
  '  --man-source) # private option, used by `make update-doc`\n' +
  '    # Print raw, embedded Markdown-formatted man-page source and exit\n' +
  '    printManPageSource; exit\n' +
  '    ;;\n' +
  '  --home)\n' +
  '    # Open the home page and exit.\n' +
  '    openUrl "$kTHIS_HOMEPAGE"; exit\n' +
  '    ;;\n' +
  'esac\n' +
  '\n' +
  '# --- Begin: SPECIFIC HELPER FUNCTIONS\n' +
  '\n' +
  '# NOTE: The functions below operate on byte strings such as the one above:\n' +
  '#       A single single string of pairs of hex digits, without separators or line breaks.\n' +
  '#       Thus, a given byte position is easily calculated: to get byte $byteIndex, use\n' +
  '#         ${byteString:byteIndex*2:2}\n' +
  '\n' +
  '# Outputs the specified EXTENDED ATTRIBUTE VALUE as a byte string (a hex dump that is a single-line string of pairs of hex digits, without separators or line breaks, such as "000A2C".\n' +
  '# IMPORTANT: Hex. digits > 9 use UPPPERCASE characters.\n' +
  '#   getAttribByteString <file> <attrib_name>\n' +
  'getAttribByteString() {\n' +
  '  xattr -px "$2" "$1" | tr -d \' \\n\'\n' +
  '  return ${PIPESTATUS[0]}\n' +
  '}\n' +
  '\n' +
  '# Outputs the specified file\'s RESOURCE FORK as a byte string (a hex dump that is a single-line string of pairs of hex digits, without separators or line breaks, such as "000a2c".\n' +
  '# IMPORTANT: Hex. digits > 9 use *lowercase* characters.\n' +
  "# Note: This function relies on `xxd -p <file>/..namedfork/rsrc | tr -d '\\n'` rather than the conceptually equivalent call,\n" +
  '#       `getAttribByteString <file> com.apple.ResourceFork`, for PERFORMANCE reasons:\n' +
  '#       getAttribByteString() (defined above) relies on `xattr`, which is a *Python* script [!! seemingly no longer, as of macOS 10.16]\n' +
  "#       and therefore quite slow due to Python's startup cost.\n" +
  '#   getResourceByteString <file>\n' +
  'getResourceByteString() {\n' +
  '  xxd -p "$1"/..namedfork/rsrc | tr -d \'\\n\'\n' +
  '}\n' +
  '\n' +
  '# Patches a single byte in the byte string provided via stdin.\n' +
  '#  patchByteInByteString ndx byteSpec\n' +
  '#   ndx is the 0-based byte index\n' +
  '# - If <byteSpec> has NO prefix: <byteSpec> becomes the new byte\n' +
  '# - If <byteSpec> has prefix \'|\': "adds" the value: the result of a bitwise OR with the existing byte becomes the new byte\n' +
  '# - If <byteSpec> has prefix \'~\': "removes" the value: the result of a applying a bitwise AND with the bitwise complement of <byteSpec> to the existing byte becomes the new byte\n' +
  'patchByteInByteString() {\n' +
  "  local ndx=$1 byteSpec=$2 byteVal byteStr charPos op='' charsBefore='' charsAfter='' currByte\n" +
  '  byteStr=$(</dev/stdin)\n' +
  '  charPos=$(( 2 * ndx ))\n' +
  '  # Validat the byte spec.\n' +
  '  case ${byteSpec:0:1} in\n' +
  "    '|')\n" +
  "      op='|'\n" +
  '      byteVal=${byteSpec:1}\n' +
  '      ;;\n' +
  "    '~')\n" +
  "      op='& ~'\n" +
  '      byteVal=${byteSpec:1}\n' +
  '      ;;\n' +
  '    *)\n' +
  '      byteVal=$byteSpec\n' +
  '      ;;\n' +
  '  esac\n' +
  '  [[ $byteVal == [0-9A-Fa-f][0-9A-Fa-f] ]] || return 1\n' +
  '  # Validat the byte index.\n' +
  '  (( charPos > 0 && charPos < ${#byteStr} )) || return 1\n' +
  '  # Determine the target byte, and strings before and after the byte to patch.\n' +
  '  (( charPos >= 2 )) && charsBefore=${byteStr:0:charPos}\n' +
  '  charsAfter=${byteStr:charPos + 2}\n' +
  '  # Determine the new byte value\n' +
  '  if [[ -n $op ]]; then\n' +
  '      currByte=${byteStr:charPos:2}\n' +
  '      printf -v patchedByte \'%02X\' "$(( 0x${currByte} $op 0x${byteVal} ))"\n' +
  '  else\n' +
  '      patchedByte=$byteSpec\n' +
  '  fi\n' +
  '  printf \'%s%s%s\' "$charsBefore" "$patchedByte" "$charsAfter"\n' +
  '}\n' +
  '\n' +
  '#  hasAttrib <fileOrFolder> <attrib_name>\n' +
  'hasAttrib() {\n' +
  '  xattr "$1" | /usr/bin/grep -Fqx "$2"\n' +
  '}\n' +
  '\n' +
  '#  hasIconsResource <file>\n' +
  'hasIconsResource() {\n' +
  '  local file=$1\n' +
  '  getResourceByteString "$file" | /usr/bin/grep -Fq "$kMAGICBYTES_ICNS_RESOURCE"\n' +
  '}\n' +
  '\n' +
  '\n' +
  '#  setCustomIcon <fileOrFolder> <imgFile>\n' +
  'setCustomIcon() {\n' +
  '\n' +
  '  local fileOrFolder=$1 imgFile=$2\n' +
  '\n' +
  '  [[ (-f $fileOrFolder || -d $fileOrFolder) && -r $fileOrFolder && -w $fileOrFolder ]] || return 3\n' +
  '  [[ -f $imgFile ]] || return 3\n' +
  '\n' +
  '  # !! Sadly, Apple decided to remove the `-i` / `--addicon` option from the `sips` utility.\n' +
  '  # !! Therefore, use of *Cocoa* is required, which we do *via AppleScript* and its ObjC bridge,\n' +
  '  # !! which has the added advantage of creating a *set* of icons from the source image, scaling as necessary\n' +
  '  # !!  to create a 512 x 512 top resolution icon (whereas sips -i created a single, 128 x 128 icon).\n' +
  '  # !! Thanks:\n' +
  '  # !!  * https://apple.stackexchange.com/a/161984/28668 (Python original)\n' +
  '  # !!  * @scriptingosx (https://github.com/mklement0/fileicon/issues/32#issuecomment-1074124748) (AppleScript-ObjC version)\n' +
  '  # !! Note: We moved from Python to AppleScript when the system Python was removed in macOS 12.3\n' +
  '\n' +
  '  # Tips for debugging:\n' +
  '  #  * To exercise this function, from the repo dir.:\n' +
  '  #      touch /tmp/tf; ./bin/fileicon set /tmp/tf ./test/.fixtures/img.png\n' +
  '\n' +
  '  # !! Note: The setIcon method seemingly always indicates True, even with invalid image files, so\n' +
  '  # !!       we attempt no error handling in the AppleScript code, and instead verify success explicitly later.\n' +
  '  osascript <<EOF >/dev/null || die\n' +
  '    use framework "Cocoa"\n' +
  '    set sourcePath to "$imgFile"\n' +
  '    set destPath to "$fileOrFolder"\n' +
  "    set imageData to (current application's NSImage's alloc()'s initWithContentsOfFile:sourcePath)\n" +
  "    (current application's NSWorkspace's sharedWorkspace()'s setIcon:imageData forFile:destPath options:2)\n" +
  'EOF\n' +
  '\n' +
  '  # Verify that a resource fork with icons was actually created.\n' +
  '  # For *files*, the resource fork is embedded in the file itself.\n' +
  "  # For *folders* a hidden file named $'Icon\\r' is created *inside the folder*.\n" +
  '  [[ -d $fileOrFolder ]] && fileWithResourceFork=${fileOrFolder}/$kFILENAME_FOLDERCUSTOMICON || fileWithResourceFork=$fileOrFolder\n' +
  '  hasIconsResource "$fileWithResourceFork" || {\n' +
  '    cat >&2 <<EOF\n' +
  'Failed to create resource fork with icons. Typically, this means that the specified image file is not supported or corrupt: $imgFile\n' +
  'Supported image formats: jpeg | tiff | png | gif | jp2 | pict | bmp | qtif| psd | sgi | tga\n' +
  'EOF\n' +
  '    return 1\n' +
  '\n' +
  '  }\n' +
  '\n' +
  '  return 0\n' +
  '}\n' +
  '\n' +
  '#  getCustomIcon <fileOrFolder> <icnsOutFile>\n' +
  'getCustomIcon() {\n' +
  '\n' +
  '  local fileOrFolder=$1 icnsOutFile=$2 byteStr fileWithResourceFork byteOffset byteCount\n' +
  '\n' +
  '  [[ (-f $fileOrFolder || -d $fileOrFolder) && -r $fileOrFolder ]] || return 3\n' +
  '\n' +
  '  # Determine what file to extract the resource fork from.\n' +
  '  if [[ -d $fileOrFolder ]]; then\n' +
  '    fileWithResourceFork=${fileOrFolder}/$kFILENAME_FOLDERCUSTOMICON\n' +
  "    [[ -f $fileWithResourceFork ]] || { echo \"Custom-icon file does not exist: '${fileWithResourceFork/$'\\r'/\\\\r}'\" >&2; return 1; }\n" +
  '  else\n' +
  '    fileWithResourceFork=$fileOrFolder\n' +
  '  fi\n' +
  '\n' +
  '  # Determine (based on format description at https://en.wikipedia.org/wiki/Apple_Icon_Image_format):\n' +
  '  # - the byte offset at which the icns resource begins, via the magic literal identifying an icns resource\n' +
  '  # - the length of the resource, which is encoded in the 4 bytes right after the magic literal.\n' +
  '  read -r byteOffset byteCount < <(getResourceByteString "$fileWithResourceFork" | /usr/bin/awk -F "$kMAGICBYTES_ICNS_RESOURCE" \'{ printf "%s %d", (length($1) + 2) / 2, "0x" substr($2, 0, 8) }\')\n' +
  "  (( byteOffset > 0 && byteCount > 0 )) || { echo \"Custom-icon file contains no icons resource: '${fileWithResourceFork/$'\\r'/\\\\r}'\" >&2; return 1; }\n" +
  '\n' +
  '  # Extract the actual bytes using tail and head and save them to the output file.\n' +
  '  tail -c "+${byteOffset}" "$fileWithResourceFork/..namedfork/rsrc" | head -c $byteCount > "$icnsOutFile" || return\n' +
  '\n' +
  '  return 0\n' +
  '}\n' +
  '\n' +
  '#  removeCustomIcon <fileOrFolder>\n' +
  'removeCustomIcon() {\n' +
  '\n' +
  '  local fileOrFolder=$1 byteStr\n' +
  '\n' +
  '  [[ (-f $fileOrFolder || -d $fileOrFolder) && -r $fileOrFolder && -w $fileOrFolder ]] || return 1\n' +
  '\n' +
  '  # Step 1: Turn off the custom-icon flag in the com.apple.FinderInfo extended attribute.\n' +
  '  if hasAttrib "$fileOrFolder" com.apple.FinderInfo; then\n' +
  '    byteStr=$(getAttribByteString "$fileOrFolder" com.apple.FinderInfo | patchByteInByteString $kFI_BYTEOFFSET_CUSTOMICON \'~\'$kFI_VAL_CUSTOMICON) || return\n' +
  '    if [[ $byteStr == "$kFI_BYTES_BLANK" ]]; then # All bytes cleared? Remove the entire attribute.\n' +
  '      xattr -d com.apple.FinderInfo "$fileOrFolder"\n' +
  '    else # Update the attribute.\n' +
  '      xattr -wx com.apple.FinderInfo "$byteStr" "$fileOrFolder" || return\n' +
  '    fi\n' +
  '  fi\n' +
  '\n' +
  '  # Step 2: Remove the resource fork (if target is a file) / hidden file with custom icon (if target is a folder)\n' +
  '  if [[ -d $fileOrFolder ]]; then\n' +
  '    rm -f "${fileOrFolder}/${kFILENAME_FOLDERCUSTOMICON}"\n' +
  '  else\n' +
  '    if hasIconsResource "$fileOrFolder"; then\n' +
  '      xattr -d com.apple.ResourceFork "$fileOrFolder"\n' +
  '    fi\n' +
  '  fi\n' +
  '\n' +
  '  return 0\n' +
  '}\n' +
  '\n' +
  '#  testForCustomIcon <fileOrFolder>\n' +
  'testForCustomIcon() {\n' +
  '\n' +
  '  local fileOrFolder=$1 byteStr byteVal fileWithResourceFork\n' +
  '\n' +
  '  [[ (-f $fileOrFolder || -d $fileOrFolder) && -r $fileOrFolder ]] || return 3\n' +
  '\n' +
  '  # Step 1: Check if the com.apple.FinderInfo extended attribute has the custom-icon\n' +
  '  #         flag set.\n' +
  '  byteStr=$(getAttribByteString "$fileOrFolder" com.apple.FinderInfo 2>/dev/null) || return 1\n' +
  '\n' +
  '  byteVal=${byteStr:2*kFI_BYTEOFFSET_CUSTOMICON:2}\n' +
  '\n' +
  '  (( byteVal & kFI_VAL_CUSTOMICON )) || return 1\n' +
  '\n' +
  '  # Step 2: Check if the resource fork of the relevant file contains an icns resource\n' +
  '  if [[ -d $fileOrFolder ]]; then\n' +
  '    fileWithResourceFork=${fileOrFolder}/${kFILENAME_FOLDERCUSTOMICON}\n' +
  '  else\n' +
  '    fileWithResourceFork=$fileOrFolder\n' +
  '  fi\n' +
  '\n' +
  '  hasIconsResource "$fileWithResourceFork" || return 1\n' +
  '\n' +
  '  return 0\n' +
  '}\n' +
  '\n' +
  '# --- End: SPECIFIC HELPER FUNCTIONS\n' +
  '\n' +
  '# --- Begin: SPECIFIC SCRIPT-GLOBAL CONSTANTS\n' +
  '\n' +
  "kFILENAME_FOLDERCUSTOMICON=$'Icon\\r'\n" +
  '\n' +
  '# The blank hex dump form (single string of pairs of hex digits) of the 32-byte data structure stored in extended attribute\n' +
  '# com.apple.FinderInfo\n' +
  "kFI_BYTES_BLANK='0000000000000000000000000000000000000000000000000000000000000000'\n" +
  '\n' +
  "# The hex dump form of the full 32 bytes that Finder assigns to the hidden $'Icon\\r'\n" +
  '# file whose com.apple.ResourceFork extended attribute contains the icon image data for the enclosing folder.\n' +
  "# The first 8 bytes spell out the magic literal 'iconMACS'; they are followed by the invisibility flag, '40' in the 9th byte, and '10' (?? specifying what?)\n" +
  '# in the 10th byte.\n' +
  "# NOTE: Since file $'Icon\\r' serves no other purpose than to store the icon, it is\n" +
  '#       safe to simply assign all 32 bytes blindly, without having to worry about\n' +
  '#       preserving existing values.\n' +
  "kFI_BYTES_CUSTOMICONFILEFORFOLDER='69636F6E4D414353401000000000000000000000000000000000000000000000'\n" +
  '\n' +
  '# The hex dump form of the magic literal inside a resource fork that marks the\n' +
  '# start of an icns (icons) resource.\n' +
  "# NOTE: This will be used with `xxd -p .. | tr -d '\\n'`, which uses *lowercase*\n" +
  '#       hex digits, so we must use lowercase here.\n' +
  "kMAGICBYTES_ICNS_RESOURCE='69636e73'\n" +
  '\n' +
  '# The byte values (as hex strings) of the flags at the relevant byte position\n' +
  '# of the com.apple.FinderInfo extended attribute.\n' +
  "kFI_VAL_CUSTOMICON='04'\n" +
  '\n' +
  '# The custom-icon-flag byte offset in the com.apple.FinderInfo extended attribute.\n' +
  'kFI_BYTEOFFSET_CUSTOMICON=8\n' +
  '\n' +
  '# --- End: SPECIFIC SCRIPT-GLOBAL CONSTANTS\n' +
  '\n' +
  '# Option defaults.\n' +
  'force=0 quiet=0\n' +
  '\n' +
  '# --- Begin: OPTIONS PARSING\n' +
  'allowOptsAfterOperands=1 operands=() i=0 optName= isLong=0 prefix= optArg= haveOptArgAttached=0 haveOptArgAsNextArg=0 acceptOptArg=0 needOptArg=0\n' +
  'while (( $# )); do\n' +
  '  if [[ $1 =~ ^(-)[a-zA-Z0-9]+.*$ || $1 =~ ^(--)[a-zA-Z0-9]+.*$ ]]; then # an option: either a short option / multiple short options in compressed form or a long option\n' +
  "    prefix=${BASH_REMATCH[1]}; [[ $prefix == '--' ]] && isLong=1 || isLong=0\n" +
  '    for (( i = 1; i < (isLong ? 2 : ${#1}); i++ )); do\n' +
  '        acceptOptArg=0 needOptArg=0 haveOptArgAttached=0 haveOptArgAsNextArg=0 optArgAttached= optArgOpt= optArgReq=\n' +
  '        if (( isLong )); then # long option: parse into name and, if present, argument\n' +
  '          optName=${1:2}\n' +
  '          [[ $optName =~ ^([^=]+)=(.*)$ ]] && { optName=${BASH_REMATCH[1]}; optArgAttached=${BASH_REMATCH[2]}; haveOptArgAttached=1; }\n' +
  '        else # short option: *if* it takes an argument, the rest of the string, if any, is by definition the argument.\n' +
  '          optName=${1:i:1}; optArgAttached=${1:i+1}; (( ${#optArgAttached} >= 1 )) && haveOptArgAttached=1\n' +
  '        fi\n' +
  '        (( haveOptArgAttached )) && optArgOpt=$optArgAttached optArgReq=$optArgAttached || { (( $# > 1 )) && { optArgReq=$2; haveOptArgAsNextArg=1; }; }\n' +
  '        # ---- BEGIN: CUSTOMIZE HERE\n' +
  '        case $optName in\n' +
  '          f|force)\n' +
  '            force=1\n' +
  '            ;;\n' +
  '          q|quiet)\n' +
  '            quiet=1\n' +
  '            ;;\n' +
  '          *)\n' +
  '            dieSyntax "Unknown option: ${prefix}${optName}."\n' +
  '            ;;\n' +
  '        esac\n' +
  '        # ---- END: CUSTOMIZE HERE\n' +
  '        (( needOptArg )) && { (( ! haveOptArgAttached && ! haveOptArgAsNextArg )) && dieSyntax "Option ${prefix}${optName} is missing its argument." || (( haveOptArgAsNextArg )) && shift; }\n' +
  '        (( acceptOptArg || needOptArg )) && break\n' +
  '    done\n' +
  '  else # an operand\n' +
  "    if [[ $1 == '--' ]]; then\n" +
  '      shift; operands+=( "$@" ); break\n' +
  '    elif (( allowOptsAfterOperands )); then\n' +
  '      operands+=( "$1" ) # continue\n' +
  '    else\n' +
  '      operands=( "$@" )\n' +
  '      break\n' +
  '    fi\n' +
  '  fi\n' +
  '  shift\n' +
  'done\n' +
  '(( "${#operands[@]}" > 0 )) && set -- "${operands[@]}"; unset allowOptsAfterOperands operands i optName isLong prefix optArgAttached haveOptArgAttached haveOptArgAsNextArg acceptOptArg needOptArg\n' +
  '# --- End: OPTIONS PARSING: "$@" now contains all operands (non-option arguments).\n' +
  '\n' +
  '# Validate the command\n' +
  "cmd=$(printf %s \"$1\" | tr '[:upper:]' '[:lower:]') # translate to all-lowercase - we don't want the command name to be case-sensitive\n" +
  "[[ $cmd == 'remove' ]] && cmd='rm'  # support alias 'remove' for 'rm'\n" +
  'case $cmd in\n' +
  '  set|get|rm|remove|test)\n' +
  '    shift\n' +
  '    ;;\n' +
  '  *)\n' +
  '    dieSyntax "Unrecognized or missing command: \'$cmd\'."\n' +
  '    ;;\n' +
  'esac\n' +
  '\n' +
  '# Validate file operands\n' +
  '(( $# > 0 )) || dieSyntax "Missing operand(s)."\n' +
  '\n' +
  '# Target file or folder.\n' +
  'targetFileOrFolder=$1 imgFile= outFile=\n' +
  '[[ -f $targetFileOrFolder || -d $targetFileOrFolder ]] || die "Target not found or neither file nor folder: \'$targetFileOrFolder\'"\n' +
  '# Make sure the target file/folder is readable, and, unless only getting or testing for an icon are requested, writeable too.\n' +
  '[[ -r $targetFileOrFolder ]] || die "Cannot access \'$targetFileOrFolder\': you do not have read permissions."\n' +
  "[[ $cmd == 'test' || $cmd == 'get' || -w $targetFileOrFolder ]] || die \"Cannot modify '$targetFileOrFolder': you do not have write permissions.\"\n" +
  '\n' +
  '# Other operands, if any, and their number.\n' +
  'valid=0\n' +
  'case $cmd in\n' +
  "  'set')\n" +
  '    (( $# <= 2 )) && {\n' +
  '      valid=1\n' +
  '      # If no image file was specified, the target file is assumed to be an image file itself whose image should be self-assigned as an icon.\n' +
  '      (( $# == 2 )) && imgFile=$2 || imgFile=$1\n' +
  '      # !! Apparently, a regular file is required - a process subsitution such\n' +
  '      # !! as `<(base64 -D <encoded-file.txt)` is NOT supported by NSImage.initWithContentsOfFile()\n' +
  '      [[ -f $imgFile && -r $imgFile ]] || die "Image file not found or not a (readable) regular file: $imgFile"\n' +
  '    }\n' +
  '    ;;\n' +
  "  'rm'|'test')\n" +
  '    (( $# == 1 )) && valid=1\n' +
  '    ;;\n' +
  "  'get')\n" +
  '    (( $# == 1 || $# == 2 )) && {\n' +
  '      valid=1\n' +
  '      outFile=$2\n' +
  "      if [[ $outFile == '-' ]]; then\n" +
  '        outFile=/dev/stdout\n' +
  '      else\n' +
  "        # By default, we extract to a file with the same filename root + '.icns'\n" +
  '        # in the current folder.\n' +
  '        [[ -z $outFile ]] && outFile=${targetFileOrFolder##*/}\n' +
  "        # Unless already specified, we append '.icns' to the output filename.\n" +
  '        mustReset=$(shopt -q nocasematch; echo $?); shopt -s nocasematch\n' +
  "        [[ $outFile =~ \\.icns$ ]] || outFile+='.icns'\n" +
  '        (( mustReset )) && shopt -u nocasematch\n' +
  '        [[ -e $outFile && $force -eq 0 ]] && die "Output file \'$outFile\' already exists. To force its replacement, use -f."\n' +
  '      fi\n' +
  '    }\n' +
  '    ;;\n' +
  'esac\n' +
  '(( valid )) || dieSyntax "Unexpected number of operands."\n' +
  '\n' +
  'case $cmd in\n' +
  "  'set')\n" +
  '    setCustomIcon "$targetFileOrFolder" "$imgFile" || die\n' +
  "    (( quiet )) || echo \"Custom icon assigned to '$targetFileOrFolder' based on '$imgFile'.\"\n" +
  '    ;;\n' +
  "  'rm')\n" +
  '    removeCustomIcon "$targetFileOrFolder" || die\n' +
  '    (( quiet )) || echo "Custom icon removed from \'$targetFileOrFolder\'."\n' +
  '    ;;\n' +
  "  'get')\n" +
  '    getCustomIcon "$targetFileOrFolder" "$outFile" || die\n' +
  "    (( quiet )) || { [[ $outFile != '/dev/stdout' ]] && echo \"Custom icon extracted to '$outFile'.\"; }\n" +
  '    exit 0\n' +
  '    ;;\n' +
  "  'test')\n" +
  '    testForCustomIcon "$targetFileOrFolder"\n' +
  '    ec=$?\n' +
  '    (( ec <= 1 )) || die\n' +
  '    if (( ! quiet )); then\n' +
  '      (( ec == 0 )) && echo "HAS custom icon: \'$targetFileOrFolder\'" || echo "Has NO custom icon: \'$targetFileOrFolder\'"\n' +
  '    fi\n' +
  '    exit $ec\n' +
  '    ;;\n' +
  '  *)\n' +
  '    die "DESIGN ERROR: unanticipated command: $cmd"\n' +
  '    ;;\n' +
  'esac\n' +
  '\n' +
  'exit 0\n' +
  '\n' +
  '####\n' +
  '# MAN PAGE MARKDOWN SOURCE\n' +
  '#  - Place a Markdown-formatted version of the man page for this script\n' +
  '#    inside the here-document below.\n' +
  '#    The document must be formatted to look good in all 3 viewing scenarios:\n' +
  '#     - as a man page, after conversion to ROFF with marked-man\n' +
  '#     - as plain text (raw Markdown source)\n' +
  '#     - as HTML (rendered Markdown)\n' +
  '#  Markdown formatting tips:\n' +
  '#   - GENERAL\n' +
  '#     To support plain-text rendering in the terminal, limit all lines to 80 chars.,\n' +
  '#     and, for similar rendering as HTML, *end every line with 2 trailing spaces*.\n' +
  '#   - HEADINGS\n' +
  '#     - For better plain-text rendering, leave an empty line after a heading\n' +
  '#       marked-man will remove it from the ROFF version.\n' +
  '#     - The first heading must be a level-1 heading containing the utility\n' +
  '#       name and very brief description; append the manual-section number\n' +
  '#       directly to the CLI name; e.g.:\n' +
  '#         # foo(1) - does bar\n' +
  "#     - The 2nd, level-2 heading must be '## SYNOPSIS' and the chapter's body\n" +
  '#       must render reasonably as plain text, because it is printed to stdout\n' +
  '#       when  `-h`, `--help` is specified:\n' +
  '#         Use 4-space indentation without markup for both the syntax line and the\n' +
  '#         block of brief option descriptions; represent option-arguments and operands\n' +
  "#         in angle brackets; e.g., '<foo>'\n" +
  '#     - All other headings should be level-2 headings in ALL-CAPS.\n' +
  '#   - TEXT\n' +
  '#      - Use NO indentation for regular chapter text; if you do, it will\n' +
  '#        be indented further than list items.\n' +
  '#      - Use 4-space indentation, as usual, for code blocks.\n' +
  '#      - Markup character-styling markup translates to ROFF rendering as follows:\n' +
  '#         `...` and **...** render as bolded (red) text\n' +
  '#         _..._ and *...* render as word-individually underlined text\n' +
  '#   - LISTS\n' +
  '#      - Indent list items by 2 spaces for better plain-text viewing, but note\n' +
  '#        that the ROFF generated by marked-man still renders them unindented.\n' +
  '#      - End every list item (bullet point) itself with 2 trailing spaces too so\n' +
  '#        that it renders on its own line.\n' +
  '#      - Avoid associating more than 1 paragraph with a list item, if possible,\n' +
  '#        because it requires the following trick, which hampers plain-text readability:\n' +
  "#        Use '&nbsp;<space><space>' in lieu of an empty line.\n" +
  '####\n' +
  ": <<'EOF_MAN_PAGE'\n" +
  '# fileicon(1) - manage file and folder custom icons\n' +
  '## SYNOPSIS\n' +
  'Manage custom icons for files and folders on macOS.\n' +
  'SET a custom icon for a file or folder:\n' +
  '    fileicon set      <fileOrFolder> [<imageFile>]\n' +
  'REMOVE a custom icon from a file or folder:\n' +
  '    fileicon rm       <fileOrFolder>\n' +
  "GET a file or folder's custom icon:\n" +
  '    fileicon get [-f] <fileOrFolder> [<iconOutputFile>]\n' +
  '    -f ... force replacement of existing output file\n' +
  'TEST if a file or folder has a custom icon:\n' +
  '    fileicon test     <fileOrFolder>\n' +
  'All forms: option -q silences status output.\n' +
  'Standard options: `--help`, `--man`, `--version`, `--home`\n' +
  '## DESCRIPTION\n' +
  '`<fileOrFolder>` is the file or folder whose custom icon should be managed.\n' +
  'Note that symlinks are followed to their (ultimate target); that is, you\n' +
  'can only assign custom icons to regular files and folders, not to symlinks\n' +
  'to them.\n' +
  '`<imageFile>` can be an image file of any format supported by the system.\n' +
  'It is converted to an icon and assigned to `<fileOrFolder>`.\n' +
  'If you omit `<imageFile>`, `<fileOrFolder>` must itself be an image file whose\n' +
  'image should become its own icon.\n' +
  '`<iconOutputFile>` specifies the file to extract the custom icon to:\n' +
  'Defaults to the filename of `<fileOrFolder>` with extension `.icns` appended.\n' +
  'If a value is specified, extension `.icns` is appended, unless already present.\n' +
  'Either way, extraction fails if the target file already exists; use `-f` to\n' +
  'override.\n' +
  'Specify `-` to extract to stdout.\n' +
  'Command `test` signals with its exit code whether a custom icon is set (0)\n' +
  'or not (1); any other exit code signals an unexpected error.\n' +
  '**Options**:\n' +
  '  * `-f`, `--force`\n' +
  '    When getting (extracting) a custom icon, forces replacement of the\n' +
  '    output file, if it already exists.\n' +
  '  * `-q`, `--quiet`\n' +
  '    Suppresses output of the status information that is by default output to\n' +
  '    stdout.\n' +
  '    Note that errors and warnings are still printed to stderr.\n' +
  '## NOTES\n' +
  'Custom icons are stored in extended attributes of the HFS+ filesystem.\n' +
  "Thus, if you copy files or folders to a different filesystem that doesn't\n" +
  'support such attributes, custom icons are lost; for instance, custom icons\n' +
  'cannot be stored in a Git repository.\n' +
  'To determine if a give file or folder has extended attributes, use\n' +
  '`ls -l@ <fileOrFolder>`.\n' +
  'When setting an image as a custom icon, a set of icons with several resolutions\n' +
  'is created, with the highest resolution at 512 x 512 pixels.\n' +
  'All icons created are square, so images with a non-square aspect ratio will\n' +
  'appear distorted; for best results, use square imges.\n' +
  '## STANDARD OPTIONS\n' +
  'All standard options provide information only.\n' +
  '* `-h, --help`\n' +
  '  Prints the contents of the synopsis chapter to stdout for quick reference.\n' +
  '* `--man`\n' +
  '  Displays this manual page, which is a helpful alternative to using `man`,\n' +
  "  if the manual page isn't installed.\n" +
  '* `--version`\n' +
  '  Prints version information.\n' +
  '\n' +
  '* `--home`\n' +
  "  Opens this utility's home page in the system's default web browser.\n" +
  '## LICENSE\n' +
  'For license information and more, visit the home page by running\n' +
  '`fileicon --home`\n' +
  'EOF_MAN_PAGE\n';

export default fileiconContent;
