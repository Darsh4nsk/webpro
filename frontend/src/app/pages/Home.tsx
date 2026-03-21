import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Book, FileText, Wrench, Sparkles, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Book,
      title: 'Physical Items',
      description: 'Share books, calculators, lab equipment, and other physical resources with your community.',
      gradient: 'from-primary to-primary-light',
      image: 'https://images.unsplash.com/photo-1770235621081-030607a06cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVhZGluZyUyMHRleHRib29rJTIwc3R1ZHklMjBkZXNrfGVufDF8fHx8MTc3MjIxNjYxM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: FileText,
      title: 'Digital Resources',
      description: 'Exchange study notes, PDFs, presentations, and digital materials to help each other succeed.',
      gradient: 'from-secondary to-secondary-light',
      image: 'https://images.unsplash.com/photo-1753613648137-602c669cbe07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbm90ZXMlMjBsYXB0b3AlMjBzdHVkZW50JTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcyMjE2NjE0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Wrench,
      title: 'Skills & Services',
      description: 'Offer or request tutoring, design help, photography, and other valuable services.',
      gradient: 'from-accent to-accent-light',
      image: 'https://images.unsplash.com/photo-1758685733940-b1c11d04f553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXRvcmluZyUyMHRlYWNoaW5nJTIwbWVudG9yc2hpcCUyMHN0dWRlbnRzfGVufDF8fHx8MTc3MjIxNjYxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="max-w-[1400px] mx-auto px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[14px] font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Campus Resource Hub
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl mb-6 leading-tight">
              Share Resources,
              <br />
              Build Community
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-lg md:text-xl leading-relaxed mb-10"
            >
              A structured platform for students to share resources, exchange knowledge,
              and support each other within your college community.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <button
                onClick={() => navigate('/browse')}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all text-[16px]"
              >
                Browse Resources
              </button>
              <button
                onClick={() => navigate('/create-listing')}
                className="px-8 py-4 glass-effect text-text-primary border-2 border-border-default rounded-xl font-semibold hover:border-primary transition-all text-[16px]"
              >
                Share a Resource
              </button>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-24"
          >
            {[
              { icon: Users, value: '50K+', label: 'Active Students', gradient: 'from-primary to-primary-light' },
              { icon: TrendingUp, value: '48K+', label: 'Resources Shared', gradient: 'from-secondary to-secondary-light' },
              { icon: Sparkles, value: '95%', label: 'Success Rate', gradient: 'from-accent to-accent-light' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect rounded-2xl p-6 border border-border-light text-center group hover:shadow-lg transition-all"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent" style={{ background: `linear-gradient(to right, var(--${stat.gradient.split(' ')[0].replace('from-', '')}), var(--${stat.gradient.split(' ')[1].replace('to-', '')}))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {stat.value}
                  </div>
                  <div className="text-text-secondary text-[14px] font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Feature Cards with Images */}
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
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
                >
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <button
                      onClick={() => navigate('/browse')}
                      className={`px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all`}
                    >
                      Explore Now
                    </button>
                  </div>
                  
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl group"
                    >
                      <img 
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-[400px] object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <p className="text-white font-semibold text-lg">Start sharing {feature.title.toLowerCase()}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 text-center relative"
          >
            <div className="glass-effect rounded-[40px] p-16 border border-border-light shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-success/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-5xl font-bold mb-6">Ready to Start Sharing?</h2>
                <p className="text-text-secondary text-xl mb-10 max-w-2xl mx-auto">
                  Join your campus community today and discover a better way to share resources
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all text-[16px]"
                  >
                    Explore Resources
                  </button>
                  <button
                    onClick={() => navigate('/create-listing')}
                    className="px-8 py-4 glass-effect text-text-primary border-2 border-border-default rounded-xl font-semibold hover:border-primary transition-all text-[16px]"
                  >
                    Create Listing
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}