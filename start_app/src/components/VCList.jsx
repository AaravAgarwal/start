import React, { useState, useEffect } from "react";
import "./VCList.css";

function VCList() {
  const [vcs, setVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    stage: "",
    min_cheque: "",
    max_cheque: "",
    investor_type: "",
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalResults, setTotalResults] = useState(0);

  const countryOptions = [
    "",
    "USA",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Canada",
    "Australia",
    "India",
    "China",
    "Japan",
    "Brazil",
    "Singapore",
    "Israel",
    "Netherlands",
    "Sweden",
    "Switzerland",
    "Mexico",
    "South Korea",
  ];

  const stageOptions = [
    "",
    "1. Idea or Patent",
    "2. Prototype",
    "3. Early Revenue",
    "4. Scaling",
  ];

  const investorTypeOptions = [
    "",
    "VC",
    "Other",
    "Corporate VC",
    "Family Office",
    "Incubator",
    "Accelerator",
    "Angel Network",
    "Public Fund",
  ];

  useEffect(() => {
    const fetchVCs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        if (filters.location) queryParams.append("location", filters.location);
        if (filters.stage) queryParams.append("stage", filters.stage);
        if (filters.min_cheque) queryParams.append("min_cheque", filters.min_cheque);
        if (filters.max_cheque) queryParams.append("max_cheque", filters.max_cheque);
        if (filters.investor_type) queryParams.append("investor_type", filters.investor_type);
        
        // Add pagination params
        queryParams.append("page", currentPage);
        queryParams.append("per_page", itemsPerPage);
        
        const fetchUrl = `http://127.0.0.1:5000/api/vcs?${queryParams.toString()}`;
        console.log("Fetching from:", fetchUrl);
        
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Expect the backend to return an object with results and metadata
        if (data.results && Array.isArray(data.results)) {
          setVcs(data.results);
          setTotalResults(data.total_count || data.results.length);
        } else if (Array.isArray(data)) {
          // Fallback if backend still returns just an array
          setVcs(data);
          setTotalResults(data.length);
        } else {
          throw new Error("Invalid data format received");
        }
        
        // Trigger the card animation after data loads
        setTimeout(() => setAnimateCards(true), 100);
      } catch (error) {
        console.error("Error fetching VC data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVCs();
  }, [filters, currentPage, itemsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setCurrentPage(1);
    // Reset the animation state to trigger animations when filter changes
    setAnimateCards(false);
  };

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      stage: "",
      min_cheque: "",
      max_cheque: "",
      investor_type: "",
    });
    setCurrentPage(1);
  };

  const getValue = (vc, key, fallback = "N/A") => {
    // Check if vc is an object
    if (!vc || typeof vc !== 'object') {
      console.error("Invalid VC object:", vc);
      return fallback;
    }

    // Check for exact key match first
    if (key in vc && vc[key] !== undefined && vc[key] !== null && vc[key] !== "") {
      return vc[key];
    }
    
    // If not found, try case-insensitive match
    const lowerKey = key.toLowerCase();
    const matchingKey = Object.keys(vc).find(k => k.toLowerCase() === lowerKey);
    
    // Return the value or fallback
    if (matchingKey && vc[matchingKey] !== undefined && vc[matchingKey] !== null && vc[matchingKey] !== "") {
      return vc[matchingKey];
    }
    
    return fallback;
  };

  const renderVcCard = (vc, index) => {
    if (!vc || typeof vc !== 'object') {
      console.error("Invalid VC object at index", index, vc);
      return null;
    }
    
    return (
      <div 
        className={`vc-card ${animateCards ? 'animate' : ''}`} 
        key={index}
        style={{ animationDelay: `${index * 0.05}s` }} // Reduced delay for better performance
      >
        <div className="vc-card-header">
          <h3>
            <a
              href={getValue(vc, "Website", "#")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getValue(vc, "Investor name", "Unnamed VC")}
            </a>
          </h3>
          <div className="vc-type-badge">{getValue(vc, "Investor type", "VC")}</div>
        </div>
        <div className="vc-card-body">
          <div className="vc-info-row">
            <div className="vc-info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{getValue(vc, "Countries of investment", "Global")}</span>
            </div>
            <div className="vc-info-item">
              <span className="info-label">Stage:</span>
              <span className="info-value">{getValue(vc, "Stage of investment", "Various")}</span>
            </div>
          </div>
          <div className="vc-info-row">
            <div className="vc-info-item cheque-range">
              <span className="info-label">Cheque Range:</span>
              <span className="info-value">
                ${getValue(vc, "First cheque minimum", "?")} - ${getValue(vc, "First cheque maximum", "?")}
              </span>
            </div>
          </div>
        </div>
        <div className="vc-card-footer">
          <a
            href={getValue(vc, "Website", "#")}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-button"
          >
            Visit Website
          </a>
        </div>
      </div>
    );
  };
  
  // Calculate total number of pages
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setAnimateCards(false);
    // Scroll back to top when changing pages
    window.scrollTo(0, 0);
  };

  // Next and previous page handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          onClick={goToPrevPage} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo; Prev
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => paginate(1)} className="pagination-button">1</button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button onClick={() => paginate(totalPages)} className="pagination-button">{totalPages}</button>
          </>
        )}
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next &raquo;
        </button>
        
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };
  
  // Calculate the range of results being displayed
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalResults);
  
  return (
    <div className="vc-list-container">
      <div className="header-section">
        <h1>VC Matches</h1>
        <div className="header-buttons">
          <button 
            className="filter-toggle-button" 
            onClick={toggleFilters}
          >
            {isFilterVisible ? "Hide Filters" : "Show Filters"}
          </button>
          {isFilterVisible && (
            <button 
              className="reset-button" 
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Form */}
      <div className={`filter-form ${isFilterVisible ? 'visible' : ''}`}>
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="location">Country</label>
            <div className="select-wrapper">
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                {countryOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option === "" ? "All Countries" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-item">
            <label htmlFor="stage">Stage</label>
            <div className="select-wrapper">
              <select
                id="stage"
                name="stage"
                value={filters.stage}
                onChange={handleFilterChange}
              >
                {stageOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option === "" ? "All Stages" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-item">
            <label htmlFor="investor_type">Investor Type</label>
            <div className="select-wrapper">
              <select
                id="investor_type"
                name="investor_type"
                value={filters.investor_type}
                onChange={handleFilterChange}
              >
                {investorTypeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option === "" ? "All Types" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="min_cheque">Min Cheque ($)</label>
            <input
              id="min_cheque"
              name="min_cheque"
              type="number"
              placeholder="Min amount"
              value={filters.min_cheque}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="max_cheque">Max Cheque ($)</label>
            <input
              id="max_cheque"
              name="max_cheque"
              type="number"
              placeholder="Max amount"
              value={filters.max_cheque}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-item">
            <label htmlFor="itemsPerPage">Results Per Page</label>
            <select
              id="itemsPerPage"
              name="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setItemsPerPage(newValue);
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.location || filters.stage || filters.min_cheque || filters.max_cheque || filters.investor_type) && (
        <div className="active-filters">
          <h3>Active Filters:</h3>
          <div className="filter-tags">
            {filters.location && (
              <div className="filter-tag">
                Country: {filters.location}
                <span className="remove-filter" onClick={() => setFilters(prev => ({ ...prev, location: "" }))}>×</span>
              </div>
            )}
            {filters.stage && (
              <div className="filter-tag">
                Stage: {filters.stage}
                <span className="remove-filter" onClick={() => setFilters(prev => ({ ...prev, stage: "" }))}>×</span>
              </div>
            )}
            {filters.investor_type && (
              <div className="filter-tag">
                Type: {filters.investor_type}
                <span className="remove-filter" onClick={() => setFilters(prev => ({ ...prev, investor_type: "" }))}>×</span>
              </div>
            )}
            {filters.min_cheque && (
              <div className="filter-tag">
                Min: ${filters.min_cheque}
                <span className="remove-filter" onClick={() => setFilters(prev => ({ ...prev, min_cheque: "" }))}>×</span>
              </div>
            )}
            {filters.max_cheque && (
              <div className="filter-tag">
                Max: ${filters.max_cheque}
                <span className="remove-filter" onClick={() => setFilters(prev => ({ ...prev, max_cheque: "" }))}>×</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="results-count">
          <p>{totalResults > 0 ? `${totalResults} VCs found (showing ${startIndex}-${endIndex})` : "No VCs found"}</p>
        </div>
      )}

      {/* Pagination - Top */}
      {!loading && !error && totalResults > itemsPerPage && renderPagination()}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Finding the perfect VCs for you...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Error loading data</h3>
          <p>{error}</p>
        </div>
      ) : vcs.length > 0 ? (
        <div className="vc-cards-container">
          {vcs.map((vc, index) => renderVcCard(vc, index))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No matching VCs found</h3>
          <p>Try adjusting your filters to see more results</p>
        </div>
      )}
      
      {/* Pagination - Bottom */}
      {!loading && !error && totalResults > itemsPerPage && renderPagination()}
    </div>
  );
}

export default VCList;