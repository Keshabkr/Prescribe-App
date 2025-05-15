import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);
  const [doctorRatings, setDoctorRatings] = useState({});

  // Mapping specialities to keywords
  const specialityKeywords = {
    "General physician": [
      "cough", "cold", "fever", "viral infection", "infection", "flu", "headache"
    ],
    Gynecologist: [
      "pregnancy", "menstruation", "fertility", "reproductive health", "periods", "gynecology"
    ],
    Dermatologist: [
      "acne", "eczema", "psoriasis", "skin rash", "itching", "skin infection"
    ],
    Pediatricians: [
      "child", "infant", "vaccination", "fever", "cough", "baby care"
    ],
    Neurologist: [
      "brain", "nerves", "spine", "seizures", "paralysis", "stroke", "headache"
    ],
    Gastroenterologist: [
      "stomach", "digestion", "liver", "ulcer", "gas", "bloating", "abdomen pain"
    ]
  };

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        // Add keywords to each doctor based on their speciality
        const enrichedDoctors = data.doctors.map((doc) => ({
          ...doc,
          keywords: specialityKeywords[doc.speciality] || []
        }));

        setDoctors(enrichedDoctors);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  // Function to generate random rating and review count
  const generateRandomRating = () => {
    const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    const reviewCount = Math.floor(Math.random() * (200 - 50) + 50);
    return { rating, reviewCount };
  };

  // Generate ratings when doctors data is loaded
  useEffect(() => {
    if (doctors.length > 0) {
      const ratings = {};
      doctors.forEach(doc => {
        ratings[doc._id] = generateRandomRating();
      });
      setDoctorRatings(ratings);
    }
  }, [doctors]);

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        setIsLoading(true);
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoading,
    setIsLoading,
    doctorRatings,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
