import { Button, Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGE_PER_PAGE = 20;

function App() {
  // console.log("key", import.meta.env.VITE_API_KEY);
  // console.log(API_KEY)
  // Here we have not used useState because while searching when typing every character it will re-render everytime
  // That's why we have used useRef it will by Default store null and we have only one input so we use useRef instead of useState
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchImages = useCallback( async () => {

    try {
      if(searchInput.current.value) {
        setErrorMsg("");
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
        );
        // console.log(data)
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMsg("Error Fetching Images.. Try again Later..")
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages])

 

  const resetSearch = () => {
    fetchImages();
    setPage(1);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    // the current property points to input field which we assign in the ref
    // current.value --> will give actual value in the search input
    console.log(searchInput.current.value);
      resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  console.log("page", page);

  return (
    <>
      <div className="container">
        <h1 className="title">Image Search</h1>
        {errorMsg &&  <p className="error-msg">{errorMsg}</p>}
        <div className="search-section">
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search Image..."
              className="search-input"
              ref={searchInput}
            />
          </Form>
        </div>
        <div className="filters">
          <div onClick={() => handleSelection("technology")}>Terchnology</div>
          <div onClick={() => handleSelection("nature")}>Nature</div>
          <div onClick={() => handleSelection("dogs")}>Dogs</div>
          <div onClick={() => handleSelection("cats")}>Cats</div>
        </div>
        <div className="images">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.urls.small}
              alt={image.alt_description}
              className="image"
            />
          ))}
        </div>

        <div className="buttons">
        {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
        {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
        </div>
      </div>
    </>
  );
}

export default App;
