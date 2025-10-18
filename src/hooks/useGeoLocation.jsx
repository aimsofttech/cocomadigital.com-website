import { useEffect, useState } from "react";
import axios from "axios";

const useGeoLocation = () => {
  const [geoLocation, setGeoLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // http://ip-api.com/json

  useEffect(() => {
    const getLocation = async () => {
      try {
        const res = await axios.get("https://ipwho.is/");
        setGeoLocation(res?.data);
      } catch (err) {
        console.error("GeoLocation Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  return { geoLocation, loading, error };
};

export default useGeoLocation;


