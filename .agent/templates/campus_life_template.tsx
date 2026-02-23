/* CAMPUS LIFE SECTION - CAMPUS HIGHLIGHTS PATTERN */
/* Replace the Campus Life grid in AboutUniversity.tsx (around lines 528-556) */

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
        { title: "Cultural Fests", desc: "Annual celebrations of art, music & dance", icon: Calendar, hoverDesc: "Experience vibrant cultural festivals throughout the year featuring classical and contemporary performances, literary events, art exhibitions, and talent showcases that bring together students from all disciplines." },
        { title: "Sports Complex", desc: "State-of-the-art athletic facilities", icon: Award, hoverDesc: "Modern sports infrastructure including cricket stadium, football field, basketball courts, indoor badminton and table tennis facilities, gymnasium, and yoga center promoting holistic student development." },
        { title: "Student Clubs", desc: "50+ clubs for diverse interests", icon: Users, hoverDesc: "Join from 50+ active clubs covering technology, literature, drama, music, photography, social service, entrepreneurship, and more. Build leadership skills and pursue your passions beyond academics." },
        { title: "Global Exchange", desc: "Partnerships with 30+ universities worldwide", icon: Globe, hoverDesc: "International collaboration programs with universities across USA, Europe, and Asia. Opportunities for student exchange, joint research projects, and exposure to global academic standards." },
    ].map((item, index) => {
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
</div>
