# Copy-Paste Templates for Campus Highlights Pattern

## Overview
This directory contains ready-to-use code templates for converting all card sections to the Campus Highlights pattern.

## Files in this Directory

### AboutUniversity.tsx Templates

1. **programs_section_template.tsx**
   - Location: Lines 361-414
   - Section: Programs (Courses Offered)
   - Features: Images for 5 programs, icon placeholders for 2

2. **campus_locations_template.tsx**
   - Location: Lines 467-488  
   - Section: Campus Locations
   - Features: Icon placeholders (can add images later)

3. **campus_life_template.tsx**
   - Location: Lines 528-556
   - Section: Campus Life
   - Features: Icon placeholders for 4 features

### AboutTPC.tsx Templates

4. **services_template.tsx**
   - Location: Lines 327-350
   - Section: Our Services
   - Features: Icon placeholders for 6 services

5. **leadership_template.tsx**
   - Location: Lines 274-308
   - Section: Meet Our Leaders
   - Features: Leader photos with aspect-square ratio

6. **training_programs_template.tsx**
   - Location: Lines 405-430
   - Section: Training Programs
   - Features: Icon placeholders for 4 programs

7. **success_stories_template.tsx**
   - Location: Lines 449-469
   - Section: Success Stories
   - Features: Icon placeholders for success metrics

## How to Use

### Step 1: Open the Target File
Open either `AboutUniversity.tsx` or `AboutTPC.tsx`

### Step 2: Locate the Section
Find the section you want to update using the line numbers provided

### Step 3: Replace the Code
1. Select the entire grid div and its contents
2. Delete the selected code
3. Copy the template code from the corresponding .tsx file
4. Paste into the file

### Step 4: Verify
- Check that all imports are present at the top of the file
- Ensure no syntax errors
- Test the hover animations

### Step 5: Repeat
Continue with the next section until all are updated

## Common Pattern Features

All templates follow these patterns:

### Motion Variants
```jsx
variants={{
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index } },
  hover: { y: -5, transition: { duration: 0.3 } }
}}
```

### Card Structure
1. Image section (aspect-video or aspect-square)
2. Content section (p-5 padding)
3. Dropdown description (motion.div with height animation)

### Hover Effects
- Image zoom (scale-110)
- Gradient overlay
- Card lift (y: -5)
- Border color change
- Title color change to accent
- Description dropdown

## Testing Checklist

After implementing each template:
- [ ] Card displays correctly
- [ ] Image/icon visible
- [ ] Hover effects work smoothly
- [ ] Description drops down on hover
- [ ] No console errors
- [ ] Responsive on mobile

## Need Help?

Refer to `campus_highlights_pattern_guide.md` for detailed implementation instructions and troubleshooting.
