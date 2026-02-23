#!/usr/bin/env python3
"""
Campus Highlights Pattern Converter
Automatically converts card sections to Campus Highlights pattern
"""

import re
import sys

def read_file(filepath):
    """Read file content"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def convert_aboutuniversity_programs(content):
    """Convert Programs section in AboutUniversity.tsx"""
    
    # New programs grid code (Campus Highlights pattern)
    new_code = '''          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>'''
    
    # Pattern to find the programs grid section
    # We'll search for the specific grid start and the map function
    pattern = r'(<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">)\s*\{programs\.map\(\(program, index\)[\s\S]*?\}\)\}\s*</div>'
    
    # Check if pattern exists
    if not re.search(pattern, content):
        print("⚠️  Could not find Programs section pattern. Please check the file.")
        return content
    
    # Replace
    modified = re.sub(pattern, new_code, content, count=1)
    
    if modified != content:
        print("✅ Programs section converted successfully!")
        return modified
    else:
        print("⚠️  No changes made to Programs section")
        return content

def main():
    """Main execution"""
    print("🚀 Campus Highlights Pattern Converter")
    print("=" * 50)
    
    # File path
    about_uni_file = "src/pages/AboutUniversity.tsx"
    
    try:
        # Read file
        print(f"\n📖 Reading {about_uni_file}...")
        content = read_file(about_uni_file)
        
        # Convert Programs section
        print("\n🔄 Converting Programs section...")
        modified_content = convert_aboutuniversity_programs(content)
        
        # Write back
        if modified_content != content:
            print(f"\n💾 Writing changes to {about_uni_file}...")
            write_file(about_uni_file, modified_content)
            print("\n✨ Done! Programs section has been converted to Campus Highlights pattern!")
            print("\n📋 Next steps:")
            print("  1. Check the file in VS Code")
            print("  2. Test in browser")
            print("  3. Run script again for other sections (coming soon)")
        else:
            print("\n⚠️  No changes were made. Check the pattern matching.")
            
    except FileNotFoundError:
        print(f"\n❌ Error: Could not find {about_uni_file}")
        print("   Make sure you're running this from the project root directory")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
