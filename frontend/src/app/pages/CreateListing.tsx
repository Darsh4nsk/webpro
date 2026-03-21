import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { getCurrentUser, addListing } from '../utils/mockData';
import { Category } from '../types';
import { ArrowLeft } from 'lucide-react';

export function CreateListing() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('physical');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [conditions, setConditions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !conditions) {
      setError('Please fill in all required fields');
      return;
    }

    if (isPaid && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid price');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to create a listing');
      return;
    }

    const newListing = addListing({
      title,
      description,
      category,
      isPaid,
      price: isPaid ? parseFloat(price) : undefined,
      conditions,
      status: 'available',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      communityId: currentUser.communityId,
      communityName: currentUser.communityName,
    });

    navigate(`/listing/${newListing.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-[700px] mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="mb-2">Create New Listing</h1>
            <p className="text-text-secondary text-[15px]">
              Share a resource with your {currentUser?.communityName} community
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-[14px]">
                  {error}
                </div>
              )}

              {/* Category Selection */}
              <div>
                <label className="block text-[14px] font-medium mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('physical')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      category === 'physical'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-[14px]">Physical</div>
                    <div className="text-[12px] text-text-secondary mt-1">Books, equipment</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('digital')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      category === 'digital'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-[14px]">Digital</div>
                    <div className="text-[12px] text-text-secondary mt-1">Notes, PDFs</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('service')}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      category === 'service'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-[14px]">Service</div>
                    <div className="text-[12px] text-text-secondary mt-1">Tutoring, skills</div>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-[14px] font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Algorithms Textbook"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-[14px] font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the resource..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                />
              </div>

              {/* Conditions */}
              <div>
                <label htmlFor="conditions" className="block text-[14px] font-medium mb-2">
                  Conditions <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="conditions"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g., Return within 2 weeks, handle with care"
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                />
              </div>

              {/* Paid/Free Toggle */}
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-[15px]">Is this a paid resource?</div>
                    <div className="text-text-secondary text-[13px] mt-1">
                      Set a price for services or resources
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaid(!isPaid)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPaid ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPaid ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {isPaid && (
                  <div>
                    <label htmlFor="price" className="block text-[13px] font-medium mb-2">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        $
                      </span>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-2 bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-[15px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded font-medium hover:bg-primary-hover transition-colors text-[15px]"
                >
                  Create Listing
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-surface text-text-primary border border-border py-3 rounded font-medium hover:bg-gray-50 transition-colors text-[15px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
