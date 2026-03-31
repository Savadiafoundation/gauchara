import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Users, Target, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import cowFeeding from "@/assets/cow-feeding.jpg";
import cowHerd from "@/assets/cow-herd.jpg";

const About = () => {
  return (
    <Layout>
      <PageHero
        title="Our Sacred Mission for"
        accentText="Gaumata"
        subtitle="About Us"
        description="GauChara supports cow welfare by providing nutritious feed, ensuring their health and well-being through high-quality silage, promoting sustainable care for Bos Indicus cows."
      />

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Born from a Deep Reverence for Gaumata
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                GauChara is a sacred initiative of the Savadia Foundation, established with
                the vision of ensuring the welfare and dignity of Bos Indicus cows across India.
                Our founders recognized the urgent need for systematic, sustainable support for
                gaushalas and the sacred cows in their care.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The word "GauChara" itself reflects our core purpose - providing grazing lands
                and nourishment for Gaumata. We believe that caring for cows is not just a duty,
                but a sacred responsibility that connects us to our cultural and spiritual heritage.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we work with over 100 gaushalas across India, providing high-quality
                silage, veterinary care, and sustainable farming education to ensure that
                thousands of sacred cows receive the care they deserve.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={cowHerd}
                alt="A herd of sacred cows grazing peacefully"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 p-6 bg-card rounded-2xl shadow-xl">
                <div className="text-4xl font-bold text-primary">2013</div>
                <div className="text-sm text-muted-foreground">Year Founded</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 section-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-sacred p-8"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every Bos Indicus cow is treated with the reverence and care
                she deserves, where gaushalas thrive as centers of compassion, and where
                communities come together to protect and honor Gaumata as an integral part
                of our spiritual heritage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-sacred p-8"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-secondary to-forest-light flex items-center justify-center">
                <Target className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide comprehensive support to gaushalas and cow welfare organizations
                through nutritious feed distribution, veterinary care, sustainable farming
                education, and community engagement, ensuring the health and dignity of
                every sacred cow in our care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary font-medium">Our Values</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              Guiding Principles
            </h2>
            <p className="text-muted-foreground text-lg">
              Our work is guided by deeply held values that reflect our commitment to
              Gaumata and the communities we serve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "Every action we take is rooted in love and compassion for Gaumata.",
              },
              {
                icon: Leaf,
                title: "Sustainability",
                description: "We promote eco-friendly farming practices that benefit cows and the environment.",
              },
              {
                icon: Shield,
                title: "Integrity",
                description: "Transparency and honesty guide all our operations and relationships.",
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in the power of collective action and community support.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent transition-all">
                  <value.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Impact Section */}
      <section className="py-20 section-forest">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Impact</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-6">
                Making a Difference Every Day
              </h2>
              <p className="text-foreground/80 mb-8 leading-relaxed font-medium">
                Through the generous support of our donors and volunteers, we have been
                able to make a significant impact in the lives of thousands of sacred cows
                across India.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "5,000+", label: "Cows Nourished" },
                  { value: "100+", label: "Gaushalas Supported" },
                  { value: "50,000+", label: "Kg Silage Distributed" },
                  { value: "500+", label: "Volunteers" },
                ].map((stat, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm font-bold text-foreground/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={cowFeeding}
                alt="Caring hands feeding a gentle cow"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Be Part of Our Sacred Mission
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-10">
              Join us in making a difference in the lives of Gaumata. Your support,
              whether through donations or volunteering, helps us continue our sacred work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-10">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-10 border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
