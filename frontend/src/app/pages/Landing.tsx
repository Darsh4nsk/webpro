import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { Book, FileText, Wrench, Shield, Users, TrendingUp, ChevronRight, Star, CheckCircle, ArrowRight, Sparkles, Zap, Heart } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 glass-effect z-50 border-b border-border-light"
      >
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UniShare
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <button
              onClick={() => navigate('/login')}
              className="text-[15px] text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all text-[15px]"
            >
              Get Started Free
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              style={{ opacity: heroOpacity, y: heroY }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[14px] font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Join 50,000+ Students Sharing Resources
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Share Smarter,
                <br />
                Learn Together
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8"
              >
                The ultimate platform for college students to exchange books, notes, and skills.
                Build connections, save money, and create a thriving campus community.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-4 flex-wrap mb-8"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all text-[16px] flex items-center gap-2 group"
                >
                  Start Sharing Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 glass-effect text-text-primary border-2 border-border-default rounded-xl font-semibold hover:bg-surface-hover hover:border-primary transition-all text-[16px]"
                >
                  See How It Works
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['👨‍🎓', '👩‍💻', '👨‍🔬', '👩‍🎨'].map((emoji, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white flex items-center justify-center">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary font-medium">Trusted by students worldwide</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                  <span className="text-sm text-text-secondary font-medium ml-2">4.9/5 rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1758270705641-acf09b68a91f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwc3R1ZHlpbmclMjB0b2dldGhlciUyMGNhbXB1c3xlbnwxfHx8fDE3NzIyMTYzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students collaborating"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
              
              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 glass-effect rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-success-light rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">48K+</div>
                    <div className="text-sm text-text-secondary">Resources Shared</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-6 -right-6 glass-effect rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">95%</div>
                    <div className="text-sm text-text-secondary">Success Rate</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Stats Section */}
      <StatsSection />

      {/* Features with Images */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Why Choose Us */}
      <WhyChooseSection />

      {/* Image Gallery CTA */}
      <ImageGalleryCTA navigate={navigate} />

      {/* Final CTA */}
      <CTASection navigate={navigate} />

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

function CategoryShowcase() {
  const categories = [
    { 
      icon: Book, 
      label: 'Physical Items', 
      count: '15,000+', 
      gradient: 'from-category-physical to-secondary-light',
      bgGradient: 'from-category-physical/10 to-secondary-light/10',
      description: 'Textbooks, calculators, equipment'
    },
    { 
      icon: FileText, 
      label: 'Digital Resources', 
      count: '25,000+', 
      gradient: 'from-category-digital to-accent-light',
      bgGradient: 'from-category-digital/10 to-accent-light/10',
      description: 'Notes, PDFs, presentations'
    },
    { 
      icon: Wrench, 
      label: 'Skills & Services', 
      count: '8,000+', 
      gradient: 'from-category-service to-primary-light',
      bgGradient: 'from-category-service/10 to-primary-light/10',
      description: 'Tutoring, design, photography'
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative group rounded-3xl p-8 bg-gradient-to-br ${category.bgGradient} border border-border-light hover:shadow-2xl transition-all overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent" style={{ background: `linear-gradient(to right, var(--${category.gradient.split(' ')[0].replace('from-', '')}), var(--${category.gradient.split(' ')[1].replace('to-', '')}))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {category.count}
                </div>
                <h3 className="mb-2 text-xl">{category.label}</h3>
                <p className="text-text-secondary text-[14px]">{category.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Trusted Across Campuses</h2>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Students are already transforming how they share and learn
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50,000+', label: 'Active Students', icon: Users, color: 'primary' },
            { value: '200+', label: 'Partner Colleges', icon: Shield, color: 'secondary' },
            { value: '95%', label: 'Success Rate', icon: CheckCircle, color: 'success' },
            { value: '48,000+', label: 'Resources Shared', icon: TrendingUp, color: 'accent' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${stat.color} to-${stat.color}-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Community-Based Security',
      description: 'Every college has its own isolated community. Only verified students from your institution can access and share resources.',
      gradient: 'from-success to-success-light',
      image: 'https://images.unsplash.com/photo-1664273891579-22f28332f3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmclMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcyMjE2Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: CheckCircle,
      title: 'Smart Request Workflow',
      description: 'Structured approval system ensures both parties agree before any exchange. Track every request from pending to completion.',
      gradient: 'from-primary to-primary-light',
      image: 'https://images.unsplash.com/photo-1758521541324-d304c5303fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnRzJTIwbGFwdG9wJTIwdGVjaG5vbG9neSUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MjIxNjM5OHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Users,
      title: 'Build Real Connections',
      description: 'Connect with fellow students, create study groups, and build lasting friendships through resource sharing.',
      gradient: 'from-secondary to-secondary-light',
      image: 'https://images.unsplash.com/photo-1693921398753-c5d114e8ae6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc2hhcmluZyUyMGJvb2tzJTIwbGlicmFyeSUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzcyMjE2Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6">Everything You Need to Share Smarter</h2>
          <p className="text-text-secondary text-xl max-w-3xl mx-auto">
            Powerful features designed specifically for student communities
          </p>
        </motion.div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <button
                    className={`px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all`}
                  >
                    Learn More
                  </button>
                </div>
                
                <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your college email and join your verified community',
      icon: Users,
      gradient: 'from-primary to-primary-light',
    },
    {
      number: '02',
      title: 'Browse & List',
      description: 'Search for resources or share what you want to offer',
      icon: Book,
      gradient: 'from-secondary to-secondary-light',
    },
    {
      number: '03',
      title: 'Request & Approve',
      description: 'Send requests or approve incoming requests instantly',
      icon: CheckCircle,
      gradient: 'from-accent to-accent-light',
    },
    {
      number: '04',
      title: 'Exchange & Complete',
      description: 'Meet up, exchange, and mark the transaction as complete',
      icon: Sparkles,
      gradient: 'from-success to-success-light',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background-base via-surface to-background-base" />
      
      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6">Get Started in Minutes</h2>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Four simple steps to start sharing and saving
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="glass-effect rounded-3xl p-8 border border-border-light hover:shadow-2xl transition-all h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="text-6xl font-bold mb-4 opacity-10">{step.number}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                    <ChevronRight className="w-6 h-6 text-primary opacity-30" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Emma Thompson',
      role: 'Computer Science, MIT',
      avatar: '👩‍💻',
      rating: 5,
      text: 'UniShare saved me hundreds on textbooks! Found everything I needed from fellow students, and when done, shared them forward. Perfect cycle!',
      gradient: 'from-primary/10 to-secondary/10'
    },
    {
      name: 'Marcus Johnson',
      role: 'Engineering, Stanford',
      avatar: '👨‍🎓',
      rating: 5,
      text: 'The request-approval system is brilliant. I feel safe knowing who I\'m exchanging with. Community-only access is a game changer!',
      gradient: 'from-secondary/10 to-accent/10'
    },
    {
      name: 'Sophia Chen',
      role: 'Business, Harvard',
      avatar: '👩‍🎨',
      rating: 5,
      text: 'Offering tutoring services through UniShare has been amazing. The structured workflow is professional, and I\'ve helped dozens of students!',
      gradient: 'from-accent/10 to-success/10'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Physics, UC Berkeley',
      avatar: '👨‍🔬',
      rating: 5,
      text: 'Got lab equipment I couldn\'t afford otherwise. The campus sharing economy is real, and this platform makes it seamless!',
      gradient: 'from-success/10 to-primary/10'
    },
    {
      name: 'Olivia Martinez',
      role: 'Biology, MIT',
      avatar: '👩‍🔬',
      rating: 5,
      text: 'Found study notes that perfectly complemented my coursework. Digital resource sharing is a total game-changer for students!',
      gradient: 'from-primary/10 to-accent/10'
    },
    {
      name: 'James Wilson',
      role: 'Design, Stanford',
      avatar: '👨‍🎨',
      rating: 5,
      text: 'As a designer, I offer services here and connect with students who need help. Win-win - they get quality work, I build my portfolio!',
      gradient: 'from-secondary/10 to-success/10'
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6">Loved by Students Everywhere</h2>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Real stories from students transforming their campus experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-effect rounded-3xl p-8 border border-border-light hover:shadow-2xl transition-all bg-gradient-to-br ${testimonial.gradient}`}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-text-primary text-[15px] leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{testimonial.name}</div>
                  <div className="text-text-secondary text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reasons = [
    { title: 'Save Money', description: 'Stop buying expensive textbooks. Access what you need for free or minimal cost.', icon: '💰' },
    { title: 'Build Connections', description: 'Meet students, create study groups, and build lasting friendships.', icon: '🤝' },
    { title: 'Sustainable', description: 'Reduce waste by reusing resources. Join the circular economy movement.', icon: '🌱' },
    { title: 'Earn & Learn', description: 'Offer your skills, earn money, and help fellow students succeed.', icon: '💡' },
    { title: 'Verified', description: 'College-exclusive access ensures verified students only.', icon: '✅' },
    { title: '24/7 Access', description: 'Request and share resources anytime from any device.', icon: '🚀' },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6">Why Students Choose UniShare</h2>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            More than a platform - it's a movement transforming campus life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-2xl p-8 border border-border-light hover:shadow-xl transition-all"
            >
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageGalleryCTA({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative rounded-[40px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1763306934271-9eaa9aa30f05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBjb2xvcmZ1bCUyMGNyZWF0aXZlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzIyMTYzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Workspace"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/90" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
          >
            <Sparkles className="w-16 h-16 text-white mb-6" />
            <h2 className="text-5xl font-bold text-white mb-6">Transform Your Campus Experience</h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl">
              Join the thousands of students already saving money and building community
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-5 bg-white text-primary rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg"
            >
              Get Started Free →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] p-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #FF6B9D 50%, #06B6D4 100%)'
          }}
        >
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Sharing?
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              Join your campus community today - it's completely free!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-10 py-5 bg-white text-primary rounded-2xl font-bold hover:shadow-2xl transition-all text-lg flex items-center gap-3"
              >
                Create Free Account
                <ArrowRight className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-white/20 text-white border-2 border-white/50 rounded-2xl font-bold hover:bg-white/30 transition-all text-lg backdrop-blur"
              >
                Sign In
              </motion.button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="glass-effect border-t border-border-light py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UniShare
            </span>
          </div>
          <p className="text-text-secondary text-lg mb-6 max-w-md">
            Empowering students to share, connect, and succeed together
          </p>
          <div className="flex items-center gap-6 mb-8">
            <button onClick={() => navigate('/signup')} className="text-text-secondary hover:text-primary transition-colors font-medium">
              Get Started
            </button>
            <button onClick={() => navigate('/login')} className="text-text-secondary hover:text-primary transition-colors font-medium">
              Sign In
            </button>
          </div>
        </div>
        <div className="border-t border-border-light pt-8 text-center">
          <p className="text-text-secondary text-sm">
            © 2026 UniShare. Built for students, by students. 💜
          </p>
        </div>
      </div>
    </footer>
  );
}