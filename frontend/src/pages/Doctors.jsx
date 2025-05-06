import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MoveUpOnRender from "../components/MoveUpOnRender";

// Mapping of specialities to their common diseases/symptoms
const specialityDiseases = {
  "General physician": [
    "cough", "cold", "fever", "flu", "viral infection", "headache", 
    "body pain", "fatigue", "sore throat", "runny nose", "fever", 
    "diarrhea", "vomiting", "nausea", "dizziness"
  ],
  "Gynecologist": [
    "pregnancy", "menstrual problems", "pcos", "infertility", 
    "menopause", "vaginal infection", "breast problems", 
    "hormonal issues", "uterine problems"
  ],
  "Dermatologist": [
    "acne", "rashes", "skin infection", "allergies", "eczema", 
    "psoriasis", "hair loss", "nail problems", "skin cancer", 
    "fungal infection", "vitiligo"
  ],
  "Pediatricians": [
    "childhood fever", "vaccination", "growth problems", 
    "childhood infections", "developmental issues", 
    "childhood asthma", "childhood allergies", 
    "nutrition problems", "behavioral issues"
  ],
  "Neurologist": [
    "headache", "migraine", "seizures", "memory problems", 
    "stroke", "parkinson's", "alzheimer's", "epilepsy", 
    "nerve pain", "dizziness", "balance problems"
  ],
  "Gastroenterologist": [
    "stomach pain", "acid reflux", "ulcer", "ibs", 
    "constipation", "diarrhea", "liver problems", 
    "gallbladder issues", "digestive problems", 
    "food intolerance"
  ]
};

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const applyFilter = () => {
    let filtered = speciality
      ? doctors.filter((doc) => doc.speciality === speciality)
      : doctors;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((doc) => {
        // Check name and speciality
        const nameMatch = doc.name.toLowerCase().includes(term);
        const specialityMatch = doc.speciality.toLowerCase().includes(term);
        
        // Check if the search term matches any disease for this doctor's speciality
        const diseases = specialityDiseases[doc.speciality] || [];
        const diseaseMatch = diseases.some(disease => 
          disease.toLowerCase().includes(term)
        );

        return nameMatch || specialityMatch || diseaseMatch;
      });
    }

    setFilterDoc(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchTerm]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col items-start gap-5 mt-5">
          <button
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""
              }`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            Filter
          </button>

          <div
            className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"
              }`}
          >
            {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((spec) => (
              <p
                key={spec}
                onClick={() =>
                  speciality === spec
                    ? navigate(`/doctors`)
                    : navigate(`/doctors/${spec}`)
                }
                className={`w-[91vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? "bg-indigo-100 text-black" : ""
                  }`}
              >
                {spec}
              </p>
            ))}
          </div>
        </div>

        <div className="w-full m-4">
          <section>
            <div className="max-w-[600px] mx-auto mb-5">
              <input
                type="text"
                placeholder="Search doctors by name, speciality, or disease (e.g. cough, flu)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </section>

          <MoveUpOnRender>
            <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
              {filterDoc.length > 0 ? (
                filterDoc.map((item, index) => (
                  <div
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
                    key={index}
                  >
                    <img className="bg-blue-50" src={item.image} alt={item.name} />
                    <div className="p-4">
                      <div className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-gray-500"}`}>
                        <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"}`}></p>
                        <p>{item.available ? "Available" : "Not Available"}</p>
                      </div>
                      <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                      <p className="text-violet-600 text-sm">{item.speciality}</p>
                      <p className="text-gray-600 text-sm">{item.address.line2}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No doctors found.</p>
              )}
            </div>
          </MoveUpOnRender>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
