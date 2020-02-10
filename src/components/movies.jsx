import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import ListGroups from "./common/listGroup";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { paginate } from "./utils/paginate";
import _ from "lodash";
import {Link} from 'react-router-dom';
import SearchBox from "./common/searchBox";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies: movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn: sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1});
  };

  getPageData = () => {

    const {
      currentPage,
      pageSize,
      selectedGenre,
      searchQuery,
      movies: allMovies,
      sortColumn
    } = this.state;

    let filtered = allMovies;

    if(searchQuery)
      filtered = allMovies.filter(m => 
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
    else if(selectedGenre && selectedGenre._id)
        filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies};

  };

  render() {
    const { length: count } = this.state.movies;
    const {
      currentPage,
      pageSize,
      sortColumn
    } = this.state;

    if (count === 0) return <p>There are no movies in the daba base.</p>;

    
    const {totalCount, data} = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroups
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        
        <div>

          <Link to="/movies/new" className="btn btn-primary" style={{ marginBottom: 30 }}>New</Link> 

          <p>Showing {totalCount} movies in the database.</p>

          <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />

          <MoviesTable
            movies={data}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
