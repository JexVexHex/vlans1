(() => {
	const steps = document.querySelectorAll('.card, .problems, .quiz');
	const progressFill = document.querySelector('.progress-fill');
	const progressPercent = document.getElementById('progressPercent');
	const total = steps.length;

	function updateProgress(index){
		const percent = Math.round(((index+1)/total)*100);
		progressFill.style.width = percent + '%';
		progressPercent.textContent = percent + '%';
	}

	// Reveal cards sequentially and update progress
	steps.forEach((el, i) => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(16px)';
		setTimeout(()=>{
			el.style.transition = 'all 420ms cubic-bezier(.2,.9,.3,1)';
			el.style.opacity = '1';
			el.style.transform = 'translateY(0)';
			updateProgress(i);
		}, 180 * i);
	});

	// Problems handlers
	document.querySelectorAll('.problems .options .btn').forEach(btn => {
		btn.addEventListener('click', e => {
			const parent = btn.closest('.problem');
			const feedback = parent.querySelector('.feedback');
			if(btn.dataset.answer === 'no'){
				feedback.textContent = 'Correct — different VLANs cannot ARP each other without a router.';
				feedback.style.color = '#7ee787';
			}else{
				feedback.textContent = 'Incorrect — hosts in different VLANs are isolated at L2.';
				feedback.style.color = '#ff9aa2';
			}
		});
	});

	// Trunk command checker
	document.getElementById('checkTrunk').addEventListener('click', () => {
		const input = document.getElementById('trunkCmd').value.trim();
		const feedback = document.getElementById('trunkCmd').nextElementSibling;
		const normalized = input.replace(/\s+/g,' ').toLowerCase();
		const expected = 'switchport trunk allowed vlan 10,20';
		if(normalized.includes('allowed vlan') && (normalized.includes('10') && normalized.includes('20'))){
			feedback.textContent = 'Looks good — that will limit the trunk to VLANs 10 and 20.';
			feedback.style.color = '#7ee787';
		}else{
			feedback.textContent = 'Try: `switchport trunk allowed vlan 10,20` — this restricts VLANs across the trunk.';
			feedback.style.color = '#ffb3b3';
		}
	});

	// Quiz data
	const quiz = [
		{q:'What is the purpose of a VLAN?', a:['Isolate broadcast domains','Increase broadcast domains','Replace routing entirely'], correct:0},
		{q:'Which standard defines VLAN tags?', a:['IEEE 802.1Q','IEEE 802.3x','RFC 1918'], correct:0},
		{q:'Which command sets an access port VLAN?', a:['switchport access vlan 10','switchport mode trunk','vlan 10'], correct:0},
		{q:'What is the default native VLAN on many Cisco switches?', a:['VLAN 1','VLAN 99','VLAN 0'], correct:0}
	];

	let currentQ = 0;
	const quizRoot = document.getElementById('quizRoot');

	function renderQuestion(index){
		quizRoot.innerHTML = '';
		const item = quiz[index];
		const qEl = document.createElement('div');
		qEl.className = 'q card';
		qEl.innerHTML = `<h3>${index+1}. ${item.q}</h3>`;
		const list = document.createElement('div');
		list.className = 'options';
		item.a.forEach((opt, idx) => {
			const b = document.createElement('button');
			b.className = 'btn small';
			b.textContent = opt;
			b.dataset.index = idx;
			b.addEventListener('click', () => {
				quizRoot.querySelectorAll('.btn.small').forEach(x=>x.classList.remove('selected'));
				b.classList.add('selected');
				b.dataset.chosen = '1';
			});
			list.appendChild(b);
		});
		qEl.appendChild(list);
		quizRoot.appendChild(qEl);
	}

	renderQuestion(currentQ);

	document.getElementById('nextQ').addEventListener('click', () => {
		if(currentQ < quiz.length - 1) currentQ++;
		renderQuestion(currentQ);
	});
	document.getElementById('prevQ').addEventListener('click', () => {
		if(currentQ > 0) currentQ--;
		renderQuestion(currentQ);
	});

	document.getElementById('submitQuiz').addEventListener('click', () => {
		let score = 0;
		document.querySelectorAll('#quizRoot .q').forEach((qEl, idx) => {
			const chosen = qEl.querySelector('.selected');
			if(chosen && Number(chosen.dataset.index) === quiz[idx].correct) score++;
		});
		const result = document.getElementById('quizResult');
		result.textContent = `You scored ${score} / ${quiz.length}`;
		if(score === quiz.length) result.style.color = '#7ee787';
		else result.style.color = '#ffb3b3';
	});

})();

