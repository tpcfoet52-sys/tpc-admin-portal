/* SERVICES SECTION - CAMPUS HIGHLIGHTS PATTERN */
/* Replace the Services grid in AboutTPC.tsx (around lines 327-350) */

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
</div>
