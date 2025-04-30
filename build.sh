#!/bin/bash

SOURCE_DIR=$(pwd)
BASENAME=$(basename "$SOURCE_DIR")
DIST_DIR="$SOURCE_DIR/dist"

# Clean and recreate dist directory
echo "Cleaning dist directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

TARGET_FILE="api-integrations/Crowdstrike_Intelligence.json"

STRING_TO_REPLACE="https://api.crowdstrike.com"
REPLACEMENTS=("https://api.crowdstrike.com" "https://api.us-2.crowdstrike.com" "https://api.eu-1.crowdstrike.com" "https://api.us-gov-1.crowdstrike.com" "https://api.us-gov-2.crowdstrike.com")
SUFFIXES=("us-1" "us-2" "eu-1" "us-gov-1" "us-gov-2")

for i in {0..4}; do
    COPY_DIR="$DIST_DIR/${BASENAME}_temp_${SUFFIXES[$i]}"
    ZIP_NAME="${BASENAME}_${SUFFIXES[$i]}"
    SUFFIX="${SUFFIXES[$i]}"
    
    echo "Creating copy for $SUFFIX in dist directory"
    
    # Remove any existing copy directory
    rm -rf "$COPY_DIR"
    
    # Create a clean copy directory
    mkdir -p "$COPY_DIR"
    
    # Copy only visible files and directories, excluding .git and other hidden files
    echo "Copying files..."
    rsync -a --exclude=".*" --exclude="dist" "$SOURCE_DIR/" "$COPY_DIR/"
    
    # Replace string in the target file using a safer approach
    if [ -f "$COPY_DIR/$TARGET_FILE" ]; then
        echo "Replacing API URL in $TARGET_FILE for $SUFFIX"
        
        # Create a temporary file for the replacement
        TEMP_FILE=$(mktemp)
        
        # Perform the replacement
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS version
            sed "s|$STRING_TO_REPLACE|${REPLACEMENTS[$i]}|g" "$COPY_DIR/$TARGET_FILE" > "$TEMP_FILE"
        else
            # Linux version
            sed "s|$STRING_TO_REPLACE|${REPLACEMENTS[$i]}|g" "$COPY_DIR/$TARGET_FILE" > "$TEMP_FILE"
        fi
        
        # Move the temporary file back to the original
        mv "$TEMP_FILE" "$COPY_DIR/$TARGET_FILE"
    else
        echo "Warning: Target file not found for $SUFFIX: $TARGET_FILE"
    fi
    
    # Create zip archive with custom suffix
    echo "Creating zip archive: $ZIP_NAME.zip"
    (cd "$DIST_DIR" && zip -q -r "$ZIP_NAME.zip" "$(basename "$COPY_DIR")")
    
    # Remove the copied directory
    echo "Removing temporary copy for $SUFFIX"
    rm -rf "$COPY_DIR"
    
    echo "Completed processing for $SUFFIX"
    echo "------------------------"
done

echo "All operations completed. Zip files are located in $DIST_DIR"
