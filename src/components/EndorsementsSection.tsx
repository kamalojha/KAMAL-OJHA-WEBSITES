import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Star,
  LogIn,
  LogOut,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../firebase/context';
import {
  EndorsementRecord,
  subscribeToEndorsements,
  submitEndorsement,
  removeEndorsement,
} from '../services/endorsementService';

export const EndorsementsSection: React.FC = () => {
  const { user, signInWithGoogle, signOutUser, isAdmin } = useAuth();
  const [endorsements, setEndorsements] = useState<EndorsementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [authorRole, setAuthorRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [relationship, setRelationship] = useState<
    'Recruiter' | 'Peer / Colleague' | 'Mentor / Professor' | 'Collaborator' | 'Visitor'
  >('Recruiter');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToEndorsements(
      (data) => {
        setEndorsements(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Failed to stream endorsements:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!authorRole.trim() || !organization.trim() || !content.trim()) {
      setStatusMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await submitEndorsement({
        authorUid: user.uid,
        authorName: user.displayName || 'Anonymous Engineer',
        authorEmail: user.email || '',
        authorPhoto: user.photoURL || undefined,
        authorRole,
        organization,
        relationship,
        content,
        rating,
      });

      setStatusMessage({ type: 'success', text: 'Thank you! Your verified endorsement has been recorded.' });
      setContent('');
      setAuthorRole('');
      setOrganization('');
    } catch (err: any) {
      console.error('Error posting endorsement:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to record endorsement. Please ensure your email is verified.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this endorsement?')) return;
    try {
      await removeEndorsement(id);
    } catch (err) {
      console.error('Failed to delete endorsement:', err);
    }
  };

  return (
    <section id="endorsements" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              Verified Social Proof
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              06. Peer & Recruiter Endorsements
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Authentic recommendations and engineering feedback stored persistently in Firebase Firestore.
            </p>
          </div>

          {/* Auth Bar */}
          <div className="self-start md:self-auto">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-950 p-2 pl-3 rounded-xl border border-slate-800">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-slate-700"
                  />
                )}
                <div className="text-xs">
                  <div className="text-slate-200 font-medium leading-none">
                    {user.displayName || user.email}
                  </div>
                  {isAdmin && (
                    <span className="text-[10px] font-mono text-emerald-400 leading-none">
                      Portfolio Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={signOutUser}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors ml-1"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Sign in with Google to Endorse</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Form (or CTA to Sign In) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <MessageSquareHeart className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Leave an Endorsement
                </h3>
              </div>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Your Job Title / Role *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior ML Lead / Recruiter"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Organization / University *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TechCorp / CU"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Relationship Context
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                      >
                        <option value="Recruiter">Recruiter</option>
                        <option value="Peer / Colleague">Peer / Colleague</option>
                        <option value="Mentor / Professor">Mentor / Professor</option>
                        <option value="Collaborator">Collaborator</option>
                        <option value="Visitor">Visitor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Overall Rating
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Your Endorsement or Recommendation *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your thoughts on Kamal's technical caliber, problem solving, projects, or work ethic..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>

                  {statusMessage && (
                    <div
                      className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                        statusMessage.type === 'success'
                          ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-300'
                          : 'bg-red-950/40 border border-red-800/50 text-red-300'
                      }`}
                    >
                      {statusMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{statusMessage.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Recording...' : 'Publish Verified Endorsement'}</span>
                  </button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-blue-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Have you worked with Kamal?</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Authenticate with your Google account to submit an endorsement. All testimonials are tied to verified credentials.
                    </p>
                  </div>
                  <button
                    onClick={signInWithGoogle}
                    className="w-full py-2.5 px-4 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in with Google</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Real-time Feed of Endorsements */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
                Loading live endorsements from Firebase Firestore...
              </div>
            ) : endorsements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-300 font-semibold text-sm">No endorsements yet</div>
                <p>Be the first recruiter, mentor, or peer to leave a recommendation for Kamal!</p>
              </div>
            ) : (
              endorsements.map((item) => (
                <article
                  key={item.id}
                  className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl hover:border-slate-700/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/60">
                      <div className="flex items-center gap-3">
                        {item.authorPhoto ? (
                          <img
                            src={item.authorPhoto}
                            alt={item.authorName}
                            className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            {item.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-white font-display">
                            {item.authorName}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="text-slate-300">{item.authorRole}</span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-500" />
                              {item.organization}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rating Stars */}
                        <div className="flex items-center">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>

                        {/* Delete action if owner or admin */}
                        {user && (user.uid === item.authorUid || isAdmin) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors ml-1"
                            title="Delete endorsement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      "{item.content}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="text-blue-400/90">{item.relationship}</span>
                    <span>
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString()
                        : 'Verified'}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
