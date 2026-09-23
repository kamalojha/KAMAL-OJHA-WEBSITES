import React, { useState, useMemo } from 'react';
import { Home, Filter, Heart, Wifi, Coffee, Wind, MapPin, IndianRupee } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  city: 'Chandigarh' | 'Greater Noida' | 'Delhi';
  type: 'Boys' | 'Girls' | 'Unisex';
  rent: number;
  rating: number;
  distanceToCampus: string;
  amenities: ('wifi' | 'ac' | 'food')[];
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'pg_1',
    name: 'Shivalik Heights Student Residency',
    city: 'Chandigarh',
    type: 'Boys',
    rent: 8500,
    rating: 4.8,
    distanceToCampus: '0.8 km from CU Gate 2',
    amenities: ['wifi', 'ac', 'food'],
  },
  {
    id: 'pg_2',
    name: 'Navodaya Girls Haven & Executive PG',
    city: 'Chandigarh',
    type: 'Girls',
    rent: 9200,
    rating: 4.9,
    distanceToCampus: '1.2 km from Academic Block',
    amenities: ['wifi', 'ac', 'food'],
  },
  {
    id: 'pg_3',
    name: 'Knowledge Park Student Villa',
    city: 'Greater Noida',
    type: 'Unisex',
    rent: 7800,
    rating: 4.6,
    distanceToCampus: '0.5 km from Metro Station',
    amenities: ['wifi', 'ac'],
  },
  {
    id: 'pg_4',
    name: 'North Campus Scholar Suites',
    city: 'Delhi',
    type: 'Boys',
    rent: 11000,
    rating: 4.7,
    distanceToCampus: '1.5 km from Metro',
    amenities: ['wifi', 'ac', 'food'],
  },
];

export const PGLifeSimulator: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [maxRent, setMaxRent] = useState<number>(12000);
  const [shortlisted, setShortlisted] = useState<string[]>(['pg_1']);

  const toggleBookmark = (id: string) => {
    setShortlisted((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((p) => {
      if (selectedCity !== 'All' && p.city !== selectedCity) return false;
      if (selectedType !== 'All' && p.type !== selectedType) return false;
      if (p.rent > maxRent) return false;
      return true;
    });
  }, [selectedCity, selectedType, maxRent]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-400" />
            <h4 className="text-base font-semibold text-white">PG Life Interactive Platform Engine</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the live reactive filtering, shortlisting bookmarks, and multi-tier database queries
          </p>
        </div>

        <div className="text-xs font-mono text-indigo-300 flex items-center gap-1.5 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-800/40">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          Shortlisted: {shortlisted.length} Homes
        </div>
      </div>

      {/* Filter Controls (Segmented clean controls) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Select City Hub</label>
          <div className="flex items-center gap-1">
            {['All', 'Chandigarh', 'Greater Noida', 'Delhi'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedCity === c
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c === 'Greater Noida' ? 'Noida' : c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Gender Occupancy</label>
          <div className="flex items-center gap-1">
            {['All', 'Boys', 'Girls', 'Unisex'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  selectedType === t
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Max Monthly Rent</span>
            <span className="text-indigo-300 font-bold">₹{maxRent.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={7000}
            max={12000}
            step={500}
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {filteredProperties.length === 0 ? (
          <div className="col-span-2 p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-lg border border-slate-800">
            No properties found matching your filter threshold. Try expanding your budget slider.
          </div>
        ) : (
          filteredProperties.map((p) => {
            const isSaved = shortlisted.includes(p.id);
            return (
              <div
                key={p.id}
                className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-white">{p.name}</h5>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{p.city}</span>
                        <span>·</span>
                        <span>{p.type} PG</span>
                        <span>·</span>
                        <span>⭐ {p.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      title={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2">{p.distanceToCampus}</div>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    {p.amenities.includes('wifi') && (
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-emerald-400" /> High-speed Wi-Fi
                      </span>
                    )}
                    {p.amenities.includes('ac') && (
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-blue-400" /> AC Fitted
                      </span>
                    )}
                    {p.amenities.includes('food') && (
                      <span className="flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-amber-400" /> 3 Meals
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                  <div className="text-xs font-mono text-white font-semibold">
                    ₹{p.rent.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ month</span>
                  </div>
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                    View Verification Dossier →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
