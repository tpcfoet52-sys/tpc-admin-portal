# Campus Highlights Card Pattern Implementation Guide

## Overview
This document provides guidance on converting all cards in AboutTPC and AboutUniversity pages to follow the **Campus Highlights** card design pattern from MediaPreview.tsx.

## Campus Highlights Pattern Summary

### Card Structure
```
Card (relative, overflow-hidden, rounded-xl, border)
├── Image Section (aspect-video)
│   ├── Image (w-full, h-full, object-cover, scales on hover)
│   └── Gradient Overlay (appears on hover)
├── Content Section (p-5, bg-card)
│   ├── Icon + Title Row
│   ├── Subtitle/Meta Info  
│   └── Dropdown Description (hidden, expands on hover)
```

### Key Features
1. **Image at Top**: Aspect-video ratio image section
2. **Content Below**: Separate content section with padding
3. **No Background Image Overlay**: Image is in its own section, not background
4. **Image Zoom**: `transition-transform duration-500 group-hover:scale-110`
5. **Gradient on Hover**: `bg-gradient-to-t from-background/90 via-background/20 to-transparent`
6. **Dropdown Description**: Uses Framer Motion's height animation
7. **Card Lift on Hover**: `y: -5` motion variant

### Motion Variants Required
```jsx
variants={{
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index } },
  hover: { y: -5, transition: { duration: 0.3 } }
}}
```

### Dropdown Animation
```jsx
<motion.div
  variants={{
    initial: { height: 0, opacity: 0 },
    animate: { height: 0, opacity: 0 },
    hover: { height: "auto", opacity: 1 }
  }}
  className="overflow-hidden"
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  <p className="text-sm text-muted-foreground mt-2 border-t border-border/50 pt-3 leading-relaxed">
    {description}
  </p>
</motion.div>
```

---

## Changes Needed

### AboutUniversity.tsx - Programs Section

#### Current Structure (Lines 361-414)
- Background image with absolute positioning
- Content overlay on image
- Full overlay appears on hover

#### New Structure Required
```jsx
<motion.div
  whileHover="hover"
  variants={{
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 * index } },
    hover: { y: -5, transition: { duration: 0.3 } }
  }}
  className="group relative overflow-hidden rounded-xl border border-border shadow-sm bg-card cursor-pointer hover:shadow-lg hover:border-accent/50 transition-all duration-300"
>
  {/* Image Section */}
  <div className="aspect-video overflow-hidden relative bg-muted">
    {program.image ? (
      <>
        <img src={program.image} alt={program.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-primary/5">
        <IconComponent className="h-16 w-16 text-primary/40" />
      </div>
    )}
  </div>

  {/* Content Section */}
  <div className="p-5 relative z-10 bg-card">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <IconComponent className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
        {program.name}
      </h3>
    </div>
    
    <p className="text-sm text-muted-foreground mb-2">
      {program.students} Students Enrolled
    </p>

    {/* Dropdown Description */}
    <motion.div
      variants={{
        initial: { height: 0, opacity: 0 },
        animate: { height: 0, opacity: 0 },
        hover: { height: "auto", opacity: 1 }
      }}
      className="overflow-hidden"
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <p className="text-sm text-muted-foreground mt-2 border-t border-border/50 pt-3 leading-relaxed">
        {program.hoverDesc}
      </p>
    </motion.div>
  </div>
</motion.div>
```

### AboutUniversity.tsx - Campus Locations (Lines 467-488)

Same pattern - image top, content below, dropdown description.

### AboutUniversity.tsx - Campus Life (Lines 528-556)

For cards without images, show placeholder with icon:
```jsx
<div className="aspect-video overflow-hidden relative bg-muted">
  <div className="w-full h-full flex items-center justify-center bg-primary/5">
    <IconComponent className="h-16 w-16 text-primary/40" />
  </div>
</div>
```

---

## AboutTPC.tsx Changes Needed

### Services Section (Lines 327-350)
- Convert to Campus Highlights pattern
- No images, use icon placeholder in image section
- Description drops down on hover

### Leadership Section (Lines 274-308)
- Leader images go in image section (aspect-video OR aspect-square)
- Name, role, quote in content section
- Full bio drops down on hover

### Training Programs (Lines 405-430)
- Icon placeholder in image section
- Title and speaker in content section  
- Full description drops down on hover

### Success Stories (Lines 449-469)
- Icon/illustration in image section
- Name, company, package in content section
- Success story details drop down on hover

---

## Implementation Steps

1. **Start with one section** (e.g., Programs in AboutUniversity)
2. **Test the pattern** with one card
3. **Apply to all cards** in that section
4. **Move to next section**
5. **Repeat for AboutTPC**

---

## Key CSS Classes Reference

### Card Container
```
group relative overflow-hidden rounded-xl border border-border shadow-sm bg-card cursor-pointer hover:shadow-lg hover:border-accent/50 transition-all duration-300
```

### Image Section
```
aspect-video overflow-hidden relative bg-muted
```

### Image
```
w-full h-full object-cover transition-transform duration-500 group-hover:scale-110
```

### Hover Gradient
```
absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300
```

### Content Section
```
p-5 relative z-10 bg-card
```

### Title Hover Color
```
group-hover:text-accent transition-colors
```

---

## Testing Checklist

- [ ] Image displays correctly (aspect-video ratio)
- [ ] Image zooms on hover
- [ ] Gradient overlay appears on hover
- [ ] Card lifts slightly on hover (y: -5)
- [ ] Description smoothly drops down
- [ ] Border color changes on hover
- [ ] Title color changes to accent on hover
- [ ] Shadow intensifies on hover
- [ ] All animations smooth (300-500ms)
- [ ] Works on all screen sizes

---

*Reference File*: `src/components/MediaPreview.tsx` (Lines 66-122)
*Implementation Date*: January 30, 2026
