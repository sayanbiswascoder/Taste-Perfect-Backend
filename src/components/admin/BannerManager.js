// components/BannerManager.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const bannerContainerRef = useRef(null)

  useEffect(() => {
    // Fetch existing banners
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/admin/banner');
      setBanners(response.data.banners); // Assuming response contains an array of banner URLs
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio.toFixed(2) === (4 / 3).toFixed(2)) {
          setFile(selectedFile);
          setError("");
        } else {
          setFile(null);
          setError("The image aspect ratio must be 4:3.");
        }
      };
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('/api/admin/banner', formData);
      setFile(null);
      setPreview(null);
      fetchBanners(); // Refresh banner list
    } catch (error) {
      console.error('Failed to upload banner:', error);
    }
  };

  const handleDelete = async (bannerUrl) => {
    try {
      await axios.delete(`/api/admin/banner`, { data: { url: bannerUrl } });
      fetchBanners(); // Refresh banner list
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  useEffect(()=> {
    bannerContainerRef.current.addEventListener('wheel',(e)=> {
      e.preventDefault()
      bannerContainerRef.current.scrollLeft += e.deltaY
    })
  },[bannerContainerRef.current])

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-black">Banners</h2>

      {/* Upload Section */}
      <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg mb-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 text-slate-500"
          />
          {preview && (
            <img src={preview} alt="Preview" className="h-20 w-auto mb-4 rounded-md" />
          )}
          <button
            onClick={handleUpload}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            disabled={!file}
          >
            Add Banner
          </button>
          {error && <span className="text-red-500">{error}</span>}
        </div>
      </div>

      {/* Display Existing Banners */}
      <div className="flex space-x-4 overflow-x-auto" ref={bannerContainerRef}>
        {banners.map((bannerUrl, index) => (
          <div key={index} className="relative">
            <img src={bannerUrl} alt={`Banner ${index + 1}`} className="min-w-80 h-48 rounded-lg shadow-lg" />
            <button
              onClick={() => handleDelete(bannerUrl)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
            >
              <MdOutlineDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;
