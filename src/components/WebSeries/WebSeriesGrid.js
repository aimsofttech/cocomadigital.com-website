
const WebSeriesGrid = () => {
  const images = [
    {
      id: 1,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Teri Baaton Mein Aisa Uljha Jiya",
      year: "2024",
      genres: "Indian Drama, Movies, Funny Movies",
    },
    {
      id: 2,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 2",
      year: "2023",
      genres: "Comedy, Adventure",
    },

    {
      id: 3,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
    {
      id: 4,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
    {
      id: 5,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
    {
      id: 6,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
    {
      id: 7,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
    {
      id: 8,
      src: "../../Images/movieimg.svg",
      bannerImg: "../../images/SingleWebSeriesDataImg.svg",
      title: "Sample Title 3",
      year: "2022",
      genres: "Drama, Thriller",
    },
  ];

  return (
    <div className="container mt-5 mb-5 py-4">
      <div className="row g-3">
        {images?.map((image) => (
          <div key={image?.id} className="col-6 col-md-3">
            <div className="image-card position-relative">
              {/* Image */}
              <img
                src={image?.src}
                alt={image?.title}
                className="img-fluid rounded"
              />
              <div className="overlay p-3 text-white d-flex flex-column justify-content-between">
                <div>
                  <img
                    src={image?.bannerImg}
                    alt={image?.title}
                    className=" rounded"
                  />
                  <h5 className="fw-bold mt-3">{image?.title}</h5>
                  <span>({image?.year})</span>
                </div>
                <div>
                  <h6>Cast</h6>
                  <p className="small">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  </p>
                  <h6>Genres</h6>
                  <p className="small">{image?.genres}</p>
                </div>
                <button className="btn btn-warning fw-bold mt-2">
                  Our Work &rarr;
                </button>
              </div>
              {/* Overlay */}
            </div>
          </div>
        ))}
      </div>
      <div className="row mt-5">
        <center>
          <button className="btn btn-dark">View More</button>
        </center>
      </div>
    </div>
  );
};

export default WebSeriesGrid;
