## STEP-BY-STEP REPLACEMENT FOR PROGRAMS SECTION

### File: AboutUniversity.tsx
### Lines to Replace: 361-414

---

## STEP 1: Find This Section
Look for the Programs grid starting at line 361. It begins with:
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

## STEP 2: Select Everything
Select from line 361 to line 414 (ending with `</div>`)

The OLD code includes:
- Background image overlay approach
- Fade in/out hover effect
- Content disappears on hover

## STEP 3: Delete the Selected Code

## STEP 4: Paste This NEW Code

```tsx
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <motion.div
                  key={program.name}
                  custom={index}
                  initial="initial"
                  whileInView="animate"
                  whileHover="hover"
                  viewport={{ once: true }}
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
                        <img
                          src={program.image}
                          alt={program.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient overlay on hover */}
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
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                          {program.name}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {program.students} Students Enrolled
                    </p>

                    {/* Animated Description - Drops down on Hover */}
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
              );
            })}
          </div>
```

## STEP 5: Save the File (Cmd+S)

## STEP 6: Check for Errors
- Open browser console
- Check terminal for TypeScript errors
- Verify no red squiggly lines in VS Code

## STEP 7: Test the Changes
- Save and reload the page
- Hover over a program card
- Check that:
  - ✅ Card lifts up
  - ✅ Image zooms
  - ✅ Description drops down
  - ✅ Title turns accent color

---

## What Changed?

### Before (OLD):
- Background image with overlay
- Full color overlay on hover
- Content fades out

### After (NEW):
- Image in top section
- Content in bottom section
- Description expands on hover
- Image zooms on hover

---

## If You See Errors:

**"motion is not defined"**
→ Already imported at top of file, should work

**"Syntax error"**
→ Make sure you copied the entire code block
→ Use auto-format (Shift+Alt+F)

**"Image not displaying"**
→ Images are already imported, should work

---

## Next Steps After This Works:

1. ✅ Programs section (you just did this!)
2. Campus Locations section
3. Campus Life section  
4. Then move to AboutTPC.tsx

---

Ready to continue to the next section once this one works!
