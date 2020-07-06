import React, { Component } from 'react';
import { battle } from '../utils/api';
import Card from './Card';
import ProfileList from './ProfileList';
import Loading from './Loading';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    };
  }
  componentDidMount() {
    const { playerOne, playerTwo } = queryString.parse(this.props.location.search);

    battle([playerOne, playerTwo])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          error: message,
          loading: false,
        });
      });
  }

  render() {
    const { winner, loser, loading, error } = this.state;

    if (loading === true) {
      return <Loading text={'Battling'} />;
    }

    if (error) {
      return <p className='center-text error'>{error}</p>;
    }

    return (
      <React.Fragment>
        <div className='grid space-around container-sm'>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Winner'}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            avatar={winner.profile.avatar_url}
            href={winner.profile.html_url}
            name={winner.profile.login}
          >
            <ProfileList profile={winner.profile} />
          </Card>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Loser'}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            avatar={loser.profile.avatar_url}
            href={loser.profile.html_url}
            name={loser.profile.login}
          >
            <ProfileList profile={loser.profile} />
          </Card>
        </div>
        <Link 
          className='btn dark-btn btn-space' 
          to='/battle'
        >
          Reset
        </Link>
      </React.Fragment>
    );
  }
}

export default Results;
