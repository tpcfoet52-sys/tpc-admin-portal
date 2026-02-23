/* TRAINING PROGRAMS SECTION - CAMPUS HIGHLIGHTS PATTERN */
/* Replace the Training Programs grid in AboutTPC.tsx (around lines 405-430) */

<div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
    {trainingPrograms.map((program, index) => (
        <motion.div
            key={program.title}
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
                    <GraduationCap className="h-16 w-16 text-accent/40" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 relative z-10 bg-card text-center">
                <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-accent" />
                    </div>
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                    {program.title}
                </h3>
                {program.desc && <p className="text-xs text-muted-foreground mb-3">{program.desc}</p>}

                <div className="pt-3 border-t border-border/40">
                    <p className="text-accent font-medium text-sm">{program.speaker}</p>
                    <p className="text-xs text-muted-foreground mt-1">{program.role}</p>
                </div>

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
                    <p className="text-sm text-muted-foreground mt-3 border-t border-border/50 pt-3 leading-relaxed">
                        {program.hoverDesc}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    ))}
</div>
