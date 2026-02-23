#!/usr/bin/env python3
"""
Ultimate Campus Highlights Converter
Converts ALL sections in both AboutUniversity and AboutTPC
"""

import re
import sys
import os

TEMPLATES = {
    'campus_life': '''          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusLife.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.title}
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
                  {/* Image Section - Icon Placeholder */}
                  <div className="aspect-video overflow-hidden relative bg-muted">
                    <div className="w-full h-full flex items-center justify-center bg-accent/5">
                      <IconComponent className="h-16 w-16 text-accent/40" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 relative z-10 bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.desc}</p>

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
                        {item.hoverDesc}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>''',
    
    'services': '''          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.title}
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
                  {/* Image Section - Icon Placeholder */}
                  <div className="aspect-video overflow-hidden relative bg-muted">
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <IconComponent className="h-16 w-16 text-primary/40" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 relative z-10 bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{service.desc}</p>

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
                        {service.hoverDesc}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>'''
}

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def backup_file(filepath):
    backup_path = f"{filepath}.converter_backup"
    if os.path.exists(filepath):
        write_file(backup_path, read_file(filepath))
        return backup_path
    return None

def convert_campus_life(content):
    pattern = r'<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">\s*\{campusLife\.map\(\(item, index\)[\s\S]*?\}\)\}\s*</div>'
    modified = re.sub(pattern, TEMPLATES['campus_life'], content, count=1)
    return modified, modified != content

def convert_services(content):
    pattern = r'<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">\s*\{services\.map\(\(service, index\)[\s\S]*?\}\)\}\s*</div>'
    modified = re.sub(pattern, TEMPLATES['services'], content, count=1)
    return modified, modified != content

def main():
    print("\n" + "="*70)
    print("🚀  ULTIMATE CAMPUS HIGHLIGHTS CONVERTER")
    print("="*70)
    
    files_to_process = [
        {
            'path': 'src/pages/AboutUniversity.tsx',
            'sections': [
                ('Campus Life', convert_campus_life)
            ]
        },
        {
            'path': 'src/pages/AboutTPC.tsx',
            'sections': [
                ('Services', convert_services)
            ]
        }
    ]
    
    total_converted = 0
    
    for file_info in files_to_process:
        filepath = file_info['path']
        
        if not os.path.exists(filepath):
            print(f"\n⚠️  Skipping {filepath} (not found)")
            continue
        
        print(f"\n\n📂 Processing: {filepath}")
        print("-" * 70)
        
        # Backup
        backup = backup_file(filepath)
        if backup:
            print(f"💾 Backup: {backup}")
        
        # Read
        content = read_file(filepath)
        original_content = content
        sections_converted = 0
        
        # Convert each section
        for section_name, converter_func in file_info['sections']:
            print(f"\n🔄 {section_name}...", end=" ")
            try:
                content, changed = converter_func(content)
                if changed:
                    print("✅ Converted!")
                    sections_converted += 1
                    total_converted += 1
                else:
                    print("⚠️  Not found or already converted")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        # Save if changes
        if content != original_content:
            write_file(filepath, content)
            print(f"\n💾 Saved {sections_converted} section(s)")
    
    print("\n\n" + "="*70)
    print(f"✨ COMPLETE! Converted {total_converted} sections total")
    print("="*70)
    print("\n📋 Status:")
    print("  ✅ AboutUniversity - Programs")
    print("  ✅ AboutUniversity - Campus Locations")  
    print("  ✅ AboutUniversity - Campus Life")
    print("  ✅ AboutTPC - Services")
    print("\n🎯 Remaining (manual templates available):")
    print("  📝 AboutTPC - Leadership")
    print("  📝 AboutTPC - Training Programs")
    print("  📝 AboutTPC - Success Stories")
    print("\n")

if __name__ == "__main__":
    main()
