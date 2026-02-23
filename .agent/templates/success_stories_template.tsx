/* SUCCESS STORIES SECTION - CAMPUS HIGHLIGHTS PATTERN */
/* Replace the Success Stories grid in AboutTPC.tsx (around lines 449-469) */

<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    {successStories.map((story, index) => (
        <motion.div
            key={story.name}
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
                    <TrendingUp className="h-16 w-16 text-accent/40" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 relative z-10 bg-card text-center">
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {story.name}
                </h3>
                <p className="text-accent font-medium mt-1">{story.company}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{story.package}</p>
                <p className="text-xs text-muted-foreground mt-1">Batch of {story.year}</p>

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
                        {story.hoverDesc}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    ))}
</div>
