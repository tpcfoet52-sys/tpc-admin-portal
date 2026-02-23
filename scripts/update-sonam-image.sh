#!/bin/bash

# Script to update Er. Sonam Singh's image
# Usage: ./scripts/update-sonam-image.sh /path/to/new-image.png

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 /path/to/new-image.png"
    echo "Example: $0 ~/Downloads/sonam-singh-new.png"
    exit 1
fi

NEW_IMAGE_PATH="$1"

if [ ! -f "$NEW_IMAGE_PATH" ]; then
    echo "Error: File not found: $NEW_IMAGE_PATH"
    exit 1
fi

# Backup the old image
OLD_IMAGE="src/assets/er-sonam-singh.jpg"
BACKUP_IMAGE="src/assets/er-sonam-singh.jpg.backup.$(date +%Y%m%d_%H%M%S)"

echo "📸 Updating Er. Sonam Singh's image..."
echo ""
echo "Current image: $OLD_IMAGE"
echo "New image: $NEW_IMAGE_PATH"
echo ""

# Create backup
cp "$OLD_IMAGE" "$BACKUP_IMAGE"
echo "✅ Backup created: $BACKUP_IMAGE"

# Get file extension from new image
EXTENSION="${NEW_IMAGE_PATH##*.}"

# Copy new image
if [ "$EXTENSION" = "jpg" ] || [ "$EXTENSION" = "jpeg" ]; then
    cp "$NEW_IMAGE_PATH" "$OLD_IMAGE"
    echo "✅ Image updated successfully!"
else
    # Convert to jpg if needed (requires imagemagick)
    if command -v convert &> /dev/null; then
        convert "$NEW_IMAGE_PATH" "$OLD_IMAGE"
        echo "✅ Image converted and updated successfully!"
    else
        # Just copy with new extension
        NEW_TARGET="src/assets/er-sonam-singh.$EXTENSION"
        cp "$NEW_IMAGE_PATH" "$NEW_TARGET"
        echo "⚠️  Image copied as $NEW_TARGET"
        echo "Note: You may need to update the import in the code if the extension changed."
    fi
fi

echo ""
echo "🎉 Done! The image has been updated."
echo "The changes will be reflected when you rebuild or if your dev server hot-reloads."
