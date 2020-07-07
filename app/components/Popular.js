import React, { Component } from 'react';
import LanguagesNav from './LanguagesNav';
import { fetchPopularRepos } from '../utils/api';
import ReposGrid from './ReposGrid';
import Loading from './Loading';


class Popular extends Component {
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = selectedLanguage => {
    this.setState({
      selectedLanguage,
      error: null,
    });

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data,
            },
          }));
        })
        .catch(() => {
          console.warn('Error fetching repos: ', error);

          this.setState({
            error: `There was an error fetching the repositories.`,
          });
        });
    }
  }

  isLoading() {
    const { selectedLanguage, repos, error } = this.state;

    return !repos[selectedLanguage] && error === null;
  }

  render() {
    const { selectedLanguage, repos, error } = this.state;

    return (
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />

        {this.isLoading() && <Loading text='Fetching Repos' />}

        {error && <p className='center-text error'>{error}</p>}

        {repos[selectedLanguage] && (
          <pre>
            <ReposGrid repos={repos[selectedLanguage]} />
          </pre>
        )}
      </React.Fragment>
    );
  }
}

export default Popular;
