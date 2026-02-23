#!/usr/bin/env python3
"""
OurAlumni Page - Campus Highlights Pattern Converter
Converts alumni cards to match the Campus Highlights pattern
"""

import re
import sys
import os

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def backup_file(filepath):
    backup_path = f"{filepath}.alumni_backup"
    if os.path.exists(filepath):
        write_file(backup_path, read_file(filepath))
        return backup_path
    return None

def convert_alumni_cards(content):
    """Convert alumni cards to Campus Highlights pattern"""
    
    new_code = '''                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alumniList.map((alumni, index) => (
                            <motion.div
                                key={alumni.name}
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
                                <div className="aspect-square overflow-hidden relative bg-muted">
                                    {alumni.image ? (
                                        <>
                                            <img
                                                src={alumni.image}
                                                alt={alumni.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                            <Award className="h-16 w-16 text-primary/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-5 relative z-10 bg-card text-center">
                                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                        {alumni.name}
                                    </h3>
                                    <p className="text-sm text-accent mt-1 font-medium">{alumni.role}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alumni.field}</p>

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
                                        <p className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-3 leading-relaxed text-left">
                                            {alumni.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>'''
    
    # Pattern to find the alumni grid
    pattern = r'<div className="grid md:grid-cols-3 gap-6">\s*\{alumniList\.map\(\(alumni, index\)[\s\S]*?\}\)\}\s*</div>'
    
    modified = re.sub(pattern, new_code, content, count=1)
    
    return modified, modified != content

def main():
    print("\n" + "="*70)
    print("🎓  OUR ALUMNI PAGE - CAMPUS HIGHLIGHTS CONVERTER")
    print("="*70)
    
    filepath = 'src/pages/OurAlumni.tsx'
    
    if not os.path.exists(filepath):
        print(f"\n❌ Error: {filepath} not found")
        sys.exit(1)
    
    print(f"\n📂 Processing: {filepath}")
    
    # Backup
    backup = backup_file(filepath)
    if backup:
        print(f"💾 Backup: {backup}")
    
    # Read
    content = read_file(filepath)
    
    # Convert
    print(f"\n🔄 Converting alumni cards...", end=" ")
    try:
        content, changed = convert_alumni_cards(content)
        if changed:
            print("✅ Converted!")
            
            # Save
            write_file(filepath, content)
            print(f"💾 Saved changes")
            
            print("\n" + "="*70)
            print("✨ SUCCESS! OurAlumni.tsx has been updated!")
            print("="*70)
            print("\n📋 Changes:")
            print("  ✅ Alumni cards now use Campus Highlights pattern")
            print("  ✅ Portrait images (aspect-square) on top")
            print("  ✅ Name, role, field in content section")
            print("  ✅ Description drops down on hover")
            print("  ✅ Image zoom effect")
            print("  ✅ Card lift animation")
            print("\n🎯 Next: Test in browser, then commit to Git")
            print("")
        else:
            print("⚠️  Not found or already converted")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
