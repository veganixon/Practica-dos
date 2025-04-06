class StorageManager {
    static saveTournament(tournament) {
        const data = {
            teams: tournament.teams,
            format: tournament.format,
            startingRound: tournament.startingRound,
            currentRound: tournament.currentRound,
            rounds: tournament.rounds,
            champion: tournament.champion
        };
        localStorage.setItem('championsLeagueTournament', JSON.stringify(data));
    }

    static loadTournament() {
        const data = localStorage.getItem('championsLeagueTournament');
        return data ? JSON.parse(data) : null;
    }

    static clearTournament() {
        localStorage.removeItem('championsLeagueTournament');
    }
}