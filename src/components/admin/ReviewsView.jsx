import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'sonner';
import { Check, X, Clock, Star, Trash2, Plus } from 'lucide-react';

const ReviewsView = ({ reviews, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [newReview, setNewReview] = useState({
    platform: 'Google',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter reviews based on status
  const approvedReviews = reviews.filter(r => r.status !== 'pending');
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const displayReviews = showPendingOnly ? pendingReviews : approvedReviews;

  const averageRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((acc, review) => acc + review.rating, 0) / approvedReviews.length).toFixed(1)
    : '0.0';

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-lime-500';
    if (rating >= 2.5) return 'bg-yellow-500';
    if (rating >= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'google':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'facebook':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'instagram':
        return 'bg-pink-500 hover:bg-pink-600';
      case 'twitter':
        return 'bg-sky-500 hover:bg-sky-600';
      case 'site':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      if (!response.ok) throw new Error('Failed to add review');
      
      toast.success('Review added successfully!');
      setShowAddForm(false);
      setNewReview({
        platform: 'Google',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0]
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to add review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReview = async (id) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      
      if (!response.ok) throw new Error('Failed to approve review');
      
      toast.success('Review approved and published!');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleRejectReview = async (id) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      });
      
      if (!response.ok) throw new Error('Failed to reject review');
      
      toast.success('Review rejected!');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) throw new Error('Failed to delete review');
      
      toast.success('Review deleted successfully!');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const data = [
    { name: 'Jan', reviews: 10 },
    { name: 'Feb', reviews: 15 },
    { name: 'Mar', reviews: 25 },
    { name: 'Apr', reviews: 40 },
    { name: 'May', reviews: 35 },
    { name: 'Jun', reviews: 50 },
  ];

  return (
    <div className="space-y-4">
      <Toaster richColors />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-gray-700">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{averageRating} ⭐</div>
            <p className="text-xs text-gray-500 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-gray-700">Approved Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedReviews.length}</div>
            <p className="text-xs text-gray-500 mt-1">Publicly visible</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingReviews.length}</div>
            <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
            <CardTitle className="text-sm font-medium text-gray-700">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {[...new Set(approvedReviews.map(r => r.platform))].map(platform => (
                <Badge key={platform} className={getPlatformColor(platform)}>
                  {platform}
                </Badge>
              ))}
              {approvedReviews.length === 0 && <span className="text-gray-400 text-sm">No data</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Review Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis dataKey="name" className="fill-gray-600" />
              <YAxis className="fill-gray-600" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                itemStyle={{ color: '#374151' }}
              />
              <Legend />
              <Line type="monotone" dataKey="reviews" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPendingOnly(false)} 
            variant={!showPendingOnly ? 'default' : 'outline'}
            className={!showPendingOnly ? 'bg-green-600' : ''}
          >
            <Check className="mr-2 h-4 w-4" />
            Approved ({approvedReviews.length})
          </Button>
          <Button 
            onClick={() => setShowPendingOnly(true)} 
            variant={showPendingOnly ? 'default' : 'outline'}
            className={showPendingOnly ? 'bg-yellow-600' : ''}
          >
            <Clock className="mr-2 h-4 w-4" />
            Pending ({pendingReviews.length})
          </Button>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add External Review'}
        </Button>
      </div>

      {/* Pending Reviews Alert */}
      {pendingReviews.length > 0 && !showPendingOnly && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              You have {pendingReviews.length} pending review(s) awaiting approval!
            </span>
          </div>
          <Button 
            onClick={() => setShowPendingOnly(true)} 
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
          >
            View Pending
          </Button>
        </div>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <Card className="shadow-lg border-2 border-green-200 bg-green-50">
          <CardHeader className="bg-green-100 border-b">
            <CardTitle className="text-gray-900">Add External Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Platform</label>
                  <Select 
                    value={newReview.platform} 
                    onValueChange={(value) => setNewReview({...newReview, platform: value})}
                  >
                    <SelectTrigger className="bg-white border-input">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Trustpilot">Trustpilot</SelectItem>
                      <SelectItem value="Site">Your Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <Select 
                    value={String(newReview.rating)} 
                    onValueChange={(value) => setNewReview({...newReview, rating: parseInt(value)})}
                  >
                    <SelectTrigger className="bg-white border-input">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars ⭐⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="4">4 Stars ⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="3">3 Stars ⭐⭐⭐</SelectItem>
                      <SelectItem value="2">2 Stars ⭐⭐</SelectItem>
                      <SelectItem value="1">1 Star ⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Input 
                  type="date" 
                  value={newReview.date}
                  onChange={(e) => setNewReview({...newReview, date: e.target.value})}
                  className="bg-white border-input"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <Textarea 
                  placeholder="Enter the customer's review comment..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="bg-white border-input"
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? 'Adding...' : 'Add Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-gray-900">
            {showPendingOnly ? 'Pending Reviews - Awaiting Approval' : 'Approved Customer Reviews'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No {showPendingOnly ? 'pending' : ''} reviews available</p>
              <p className="text-sm mt-2">
                {showPendingOnly 
                  ? 'No reviews awaiting approval.' 
                  : 'Reviews from customers will appear here. Users can submit reviews from the Contact page.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayReviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`p-4 border-2 rounded-lg transition-colors bg-white ${
                    review.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPlatformColor(review.platform)}>
                        {review.platform}
                      </Badge>
                      {review.name && (
                        <span className="text-sm font-medium text-gray-700">- {review.name}</span>
                      )}
                      <span className="text-sm text-gray-500">{review.date}</span>
                      {review.status === 'pending' && (
                        <Badge className="bg-yellow-500">Pending</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      {showPendingOnly ? (
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveReview(review.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectReview(review.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          className="bg-red-500 hover:bg-red-600 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getRatingColor(review.rating)}`}>
                      {review.rating} / 5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsView;
