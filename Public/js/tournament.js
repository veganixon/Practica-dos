class Tournament {
    constructor(teams, format, startingRound) {
        this.teams = teams;
        this.format = format;
        this.startingRound = startingRound;
        this.currentRound = startingRound;
        this.rounds = {
            round16: { name: "Octavos de final", matches: [] },
            round8: { name: "Cuartos de final", matches: [] },
            round4: { name: "Semifinales", matches: [] },
            round2: { name: "Final", matches: [] }
        };
        this.champion = null;
        this.generateInitialBracket();
    }

    generateInitialBracket() {
        
        const shuffledTeams = [...this.teams].sort(() => Math.random() - 0.5);
        
        if (this.startingRound === 'round16') {
            for (let i = 0; i < 16; i += 2) {
                this.rounds.round16.matches.push({
                    team1: shuffledTeams[i] || `Equipo ${i+1}`,
                    team2: shuffledTeams[i + 1] || `Equipo ${i+2}`,
                    score1: null,
                    score2: null,
                    winner: null
                });
            }
        } else if (this.startingRound === 'round8') {
            for (let i = 0; i < 8; i += 2) {
                this.rounds.round8.matches.push({
                    team1: shuffledTeams[i] || `Equipo ${i+1}`,
                    team2: shuffledTeams[i + 1] || `Equipo ${i+2}`,
                    score1: null,
                    score2: null,
                    winner: null
                });
            }
        }
    }

    simulateRound() {
        if (!this.currentRound) return;
        
        const currentRound = this.currentRound;
        const matches = this.rounds[currentRound].matches;
        
        for (const match of matches) {
            if (!match.winner) {
                match.score1 = Math.floor(Math.random() * 5);
                match.score2 = Math.floor(Math.random() * 5);
                
                if (match.score1 > match.score2) {
                    match.winner = match.team1;
                } else if (match.score2 > match.score1) {
                    match.winner = match.team2;
                } else {
                    
                    match.winner = Math.random() > 0.5 ? match.team1 : match.team2;
                    match.score1 = match.score1 + Math.floor(Math.random() * 3);
                    match.score2 = match.score2 + Math.floor(Math.random() * 2);
                }
            }
        }
        
        if (this.allMatchesCompleted(currentRound)) {
            this.advanceToNextRound();
        }
    }

    simulateAll() {
        while (this.currentRound && !this.champion) {
            this.simulateRound();
        }
    }

    allMatchesCompleted(round) {
        return this.rounds[round].matches.every(match => match.winner);
    }

    advanceToNextRound() {
        const currentRound = this.currentRound;
        const winners = this.rounds[currentRound].matches.map(match => match.winner);
        
        let nextRound;
        if (currentRound === 'round16') nextRound = 'round8';
        else if (currentRound === 'round8') nextRound = 'round4';
        else if (currentRound === 'round4') nextRound = 'round2';
        else if (currentRound === 'round2') {
            this.champion = winners[0];
            this.currentRound = null;
            return;
        }
        
        this.currentRound = nextRound;
        for (let i = 0; i < winners.length; i += 2) {
            this.rounds[nextRound].matches.push({
                team1: winners[i],
                team2: winners[i + 1],
                score1: null,
                score2: null,
                winner: null
            });
        }
    }

    getBracketData() {
        return {
            rounds: this.rounds,
            currentRound: this.currentRound,
            champion: this.champion
        };
    }
}