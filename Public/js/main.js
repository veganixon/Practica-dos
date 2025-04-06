document.addEventListener('DOMContentLoaded', () => {
    
    const tournamentFormatSelect = document.getElementById('tournament-format');
    const startingRoundSelect = document.getElementById('starting-round');
    const teamsListTextarea = document.getElementById('teams-list');
    const generateBracketBtn = document.getElementById('generate-bracket');
    const resetAppBtn = document.getElementById('reset-app');
    const simulateRoundBtn = document.getElementById('simulate-round');
    const simulateAllBtn = document.getElementById('simulate-all');
    const bracketContainer = document.getElementById('bracket-container');
    const winnerSection = document.getElementById('winner-section');
    const championContainer = document.getElementById('champion-container');

    let tournament = null;

    
    loadSavedTournament();

    
    generateBracketBtn.addEventListener('click', generateBracket);
    resetAppBtn.addEventListener('click', resetApp);
    simulateRoundBtn.addEventListener('click', simulateRound);
    simulateAllBtn.addEventListener('click', simulateAll);

    tournamentFormatSelect.addEventListener('change', () => {
        if (tournamentFormatSelect.value === '8') {
            startingRoundSelect.value = 'round8';
            startingRoundSelect.querySelector('option[value="round16"]').disabled = true;
        } else {
            startingRoundSelect.querySelector('option[value="round16"]').disabled = false;
        }
    });

    function generateBracket() {
        const teamNames = teamsListTextarea.value.split(',').map(name => name.trim()).filter(name => name);
        const format = tournamentFormatSelect.value;
        const startingRound = startingRoundSelect.value;
        
        
        const requiredTeams = parseInt(format);
        if (teamNames.length < requiredTeams) {
            alert(`Necesitas ingresar al menos ${requiredTeams} equipos para este formato.`);
            return;
        }
        
       
        tournament = new Tournament(teamNames.slice(0, requiredTeams), format, startingRound);
        
        
        StorageManager.saveTournament(tournament);
        renderBracket();
        
        
        simulateRoundBtn.disabled = false;
        simulateAllBtn.disabled = false;
        
        
        winnerSection.classList.add('hidden');
    }

    function renderBracket() {
        if (!tournament) return;
        
        const bracketData = tournament.getBracketData();
        let html = '';
        
        
        for (const [roundKey, roundData] of Object.entries(bracketData.rounds)) {
            if (roundData.matches.length === 0 && roundKey !== bracketData.currentRound) continue;
                
            html += `<div class="round">
                <h3 class="round-title">${roundData.name}</h3>
                <div class="matches-container">`;
            
            for (const match of roundData.matches) {
                const team1Class = match.winner === match.team1 ? 'winner' : '';
                const team2Class = match.winner === match.team2 ? 'winner' : '';
                
                html += `<div class="match">
                    <div class="team ${team1Class}">
                        <span class="team-name">${match.team1}</span>
                        <span class="team-score">${match.score1 !== null ? match.score1 : '-'}</span>
                    </div>
                    <div class="team ${team2Class}">
                        <span class="team-name">${match.team2}</span>
                        <span class="team-score">${match.score2 !== null ? match.score2 : '-'}</span>
                    </div>
                </div>`;
            }
            
            html += `</div></div>`;
        }
        
        bracketContainer.innerHTML = html;
        
        
        if (bracketData.champion) {
            championContainer.innerHTML = `
                <div class="champion-trophy">🏆</div>
                <div class="champion-name">${bracketData.champion}</div>
                <p>¡Es el campeón de la Champions League!</p>
            `;
            winnerSection.classList.remove('hidden');
            simulateRoundBtn.disabled = true;
            simulateAllBtn.disabled = true;
        }
    }

    function simulateRound() {
        if (!tournament) return;
        
        tournament.simulateRound();
        StorageManager.saveTournament(tournament);
        renderBracket();
    }

    function simulateAll() {
        if (!tournament) return;
        
        tournament.simulateAll();
        StorageManager.saveTournament(tournament);
        renderBracket();
    }

    function loadSavedTournament() {
        const savedData = StorageManager.loadTournament();
        
        if (savedData) {
            
            tournament = new Tournament(savedData.teams, savedData.format, savedData.startingRound);
            
          
            tournament.currentRound = savedData.currentRound;
            tournament.rounds = savedData.rounds;
            tournament.champion = savedData.champion;
            
           
            renderBracket();
            
            if (!tournament.champion) {
                simulateRoundBtn.disabled = false;
                simulateAllBtn.disabled = false;
            }
            
            
            tournamentFormatSelect.value = savedData.format;
            startingRoundSelect.value = savedData.startingRound;
            teamsListTextarea.value = savedData.teams.join(', ');
        }
    }

    function resetApp() {
        if (confirm('¿Estás seguro que deseas resetear la aplicación? Se perderán todos los datos.')) {
            StorageManager.clearTournament();
            tournament = null;
            bracketContainer.innerHTML = '';
            teamsListTextarea.value = '';
            tournamentFormatSelect.value = '16';
            startingRoundSelect.value = 'round16';
            startingRoundSelect.querySelector('option[value="round16"]').disabled = false;
            simulateRoundBtn.disabled = true;
            simulateAllBtn.disabled = true;
            winnerSection.classList.add('hidden');
        }
    }
});