/* LEADERSHIP SECTION - CAMPUS HIGHLIGHTS PATTERN */
/* Replace the Leadership grid in AboutTPC.tsx (around lines 274-308) */

<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    {[
        {
            name: "Prof. S.P. Singh",
            role: "Dean, Faculty of Engineering & Technology",
            image: profSpSingh,
            quote: "Our mission is to nurture industry-ready professionals who contribute to nation-building.",
            hoverDesc: "With decades of academic excellence and leadership, Prof. S.P. Singh oversees the strategic vision of engineering education at University of Lucknow. His commitment to student success drives our placement initiatives and industry partnerships."
        },
        {
            name: "Dr. Himanshu Pandey",
            role: "Associate Professor & Program Coordinator, Additional Director CPC",
            image: drHimanshuPandey,
            hoverDesc: "Dr. Himanshu Pandey brings innovative approaches to career development and placement strategies. His extensive industry connections and student-centric approach have significantly enhanced placement outcomes and training programs.",
            quote: "We bridge academia and industry through strategic partnerships and comprehensive training."
        },
    ].map((leader, index) => (
        <motion.div
            key={leader.name}
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
                <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-5 relative z-10 bg-card text-center">
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {leader.name}
                </h3>
                <p className="text-sm text-accent mt-1">{leader.role}</p>
                <p className="text-sm text-muted-foreground mt-3 italic">"{leader.quote}"</p>

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
                        {leader.hoverDesc}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    ))}
</div>
