(() => {
	// Scroll-based progress tracking
	let currentLessonInView = 1;
	const totalLessons = 10;

	// Calculate progress based on lesson visibility and scroll position
	function updateScrollProgress() {
		const lessons = document.querySelectorAll('.lesson');
		const scrollTop = window.pageYOffset;
		const windowHeight = window.innerHeight;
		
		// Find which lesson is most visible
		let maxVisibleRatio = 0;
		let currentLessonProgress = 0;
		let lessonIndex = 0;
		
		lessons.forEach((lesson, index) => {
			const rect = lesson.getBoundingClientRect();
			const lessonTop = rect.top + scrollTop;
			const lessonBottom = lessonTop + rect.height;
			
			// Calculate how much of this lesson is visible
			const visibleTop = Math.max(lessonTop, scrollTop);
			const visibleBottom = Math.min(lessonBottom, scrollTop + windowHeight);
			const visibleHeight = Math.max(0, visibleBottom - visibleTop);
			const visibleRatio = visibleHeight / rect.height;
			
			if (visibleRatio > maxVisibleRatio) {
				maxVisibleRatio = visibleRatio;
				lessonIndex = index;
				// Calculate progress within this lesson
				const lessonScrollProgress = Math.max(0, Math.min(1, (scrollTop - lessonTop) / rect.height));
				currentLessonProgress = lessonScrollProgress;
			}
		});
		
		// Calculate overall progress: completed lessons + current lesson progress
		const overallProgress = (lessonIndex + currentLessonProgress) / lessons.length;
		const scrollPercent = Math.round(overallProgress * 100);
		
		document.querySelector('.progress-fill').style.width = scrollPercent + '%';
		document.getElementById('progressPercent').textContent = scrollPercent + '%';
	}

	// Intersection Observer to track lesson visibility
	function setupLessonObserver() {
		const lessons = document.querySelectorAll('.lesson');
		const options = {
			threshold: 0.5,
			rootMargin: '-100px 0px -50% 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const lessonNum = parseInt(entry.target.dataset.lesson);
				const btn = document.querySelector(`a[data-lesson="${lessonNum}"]`);
				
				if (entry.isIntersecting) {
					// Remove in-view class from all buttons
					document.querySelectorAll('.lesson-btn').forEach(b => b.classList.remove('in-view'));
					// Add in-view class to current button
					if (btn) btn.classList.add('in-view');
					currentLessonInView = lessonNum;
				}
			});
		}, options);

		lessons.forEach(lesson => observer.observe(lesson));
	}

	// Scroll event listener with throttling
	function setupScrollListener() {
		let ticking = false;
		
		function handleScroll() {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateScrollProgress();
					ticking = false;
				});
				ticking = true;
			}
		}
		
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleScroll);
		
		// Initial call
		setTimeout(updateScrollProgress, 100);
	}

	// Interactive Problems in Lesson 10
	document.querySelectorAll('.problem .options .btn').forEach(btn => {
		btn.addEventListener('click', e => {
			const parent = btn.closest('.problem');
			const feedback = parent.querySelector('.feedback');
			const buttons = parent.querySelectorAll('.btn');
			
			// Remove previous selections
			buttons.forEach(b => b.classList.remove('selected'));
			btn.classList.add('selected');
			
			// VLAN isolation problem
			if (parent.querySelector('h4').textContent.includes('VLAN Isolation')) {
				if (btn.dataset.answer === 'no') {
					feedback.textContent = '✅ Correct! Different VLANs cannot communicate without a router (inter-VLAN routing).';
					feedback.style.background = 'rgba(16,185,129,0.1)';
					feedback.style.color = '#10b981';
					feedback.style.border = '1px solid #10b981';
				} else {
					feedback.textContent = '❌ Incorrect. VLANs create separate broadcast domains - they cannot communicate without routing.';
					feedback.style.background = 'rgba(239,68,68,0.1)';
					feedback.style.color = '#ef4444';
					feedback.style.border = '1px solid #ef4444';
				}
			}
			
			// Native VLAN security problem
			if (parent.querySelector('h4').textContent.includes('Native VLAN Security')) {
				if (btn.dataset.answer === 'correct') {
					feedback.textContent = '✅ Correct! VLAN 1 carries management traffic and is vulnerable to VLAN hopping attacks.';
					feedback.style.background = 'rgba(16,185,129,0.1)';
					feedback.style.color = '#10b981';
					feedback.style.border = '1px solid #10b981';
				} else {
					feedback.textContent = '❌ Incorrect. The main security risk is management traffic exposure and potential VLAN hopping.';
					feedback.style.background = 'rgba(239,68,68,0.1)';
					feedback.style.color = '#ef4444';
					feedback.style.border = '1px solid #ef4444';
				}
			}
		});
	});

	// Trunk command checker
	document.getElementById('checkTrunk').addEventListener('click', () => {
		const input = document.getElementById('trunkCmd').value.trim().toLowerCase();
		const feedback = input.nextElementSibling || document.querySelector('#checkTrunk').nextElementSibling;
		
		const correctAnswers = [
			'switchport trunk allowed vlan 10,20,99',
			'switchport trunk allowed vlan 10 20 99',
			'switchport trunk allowed vlan 10-20,99'
		];
		
		const isCorrect = correctAnswers.some(answer => 
			input.includes('allowed vlan') && 
			input.includes('10') && 
			input.includes('20') && 
			input.includes('99')
		);
		
		if (isCorrect) {
			feedback.textContent = '✅ Excellent! This command restricts the trunk to only carry VLANs 10, 20, and 99.';
			feedback.style.background = 'rgba(16,185,129,0.1)';
			feedback.style.color = '#10b981';
			feedback.style.border = '1px solid #10b981';
		} else {
			feedback.textContent = '❌ Try: "switchport trunk allowed vlan 10,20,99" - this limits which VLANs can traverse the trunk.';
			feedback.style.background = 'rgba(239,68,68,0.1)';
			feedback.style.color = '#ef4444';
			feedback.style.border = '1px solid #ef4444';
		}
	});

	// Comprehensive Quiz Data (15 questions)
	const quiz = [
		{
			q: 'What is the primary purpose of VLANs?',
			a: ['Create separate broadcast domains', 'Increase network speed', 'Replace physical switches', 'Reduce cable costs'],
			correct: 0,
			explanation: 'VLANs create logical broadcast domains, isolating traffic and improving network performance and security.'
		},
		{
			q: 'Which IEEE standard defines VLAN tagging?',
			a: ['IEEE 802.1Q', 'IEEE 802.3', 'IEEE 802.11', 'IEEE 802.1X'],
			correct: 0,
			explanation: 'IEEE 802.1Q defines the standard for VLAN tagging in Ethernet networks.'
		},
		{
			q: 'How many bytes is the 802.1Q VLAN tag?',
			a: ['2 bytes', '4 bytes', '6 bytes', '8 bytes'],
			correct: 1,
			explanation: 'The 802.1Q VLAN tag is 4 bytes: 2 bytes TPID + 2 bytes TCI.'
		},
		{
			q: 'What is the TPID value in an 802.1Q tag?',
			a: ['0x8100', '0x0800', '0x86DD', '0x0806'],
			correct: 0,
			explanation: 'The TPID (Tag Protocol Identifier) is set to 0x8100 to indicate an 802.1Q VLAN tag.'
		},
		{
			q: 'What is the usable VLAN ID range?',
			a: ['0-4095', '1-4094', '1-1024', '2-4093'],
			correct: 1,
			explanation: 'VLAN IDs 1-4094 are usable. 0 and 4095 are reserved.'
		},
		{
			q: 'Which port type connects end devices?',
			a: ['Trunk port', 'Access port', 'Native port', 'Tagged port'],
			correct: 1,
			explanation: 'Access ports connect end devices and carry traffic for only one VLAN.'
		},
		{
			q: 'Which port type carries multiple VLANs?',
			a: ['Access port', 'Trunk port', 'Native port', 'Untagged port'],
			correct: 1,
			explanation: 'Trunk ports carry traffic for multiple VLANs using VLAN tags.'
		},
		{
			q: 'What is the default native VLAN on Cisco switches?',
			a: ['VLAN 0', 'VLAN 1', 'VLAN 99', 'VLAN 4094'],
			correct: 1,
			explanation: 'VLAN 1 is the default native VLAN on Cisco switches, though this should be changed for security.'
		},
		{
			q: 'How is native VLAN traffic sent across a trunk?',
			a: ['Tagged', 'Untagged', 'Encrypted', 'Compressed'],
			correct: 1,
			explanation: 'Native VLAN traffic is sent untagged across trunk links.'
		},
		{
			q: 'Which command creates a VLAN named "SALES" with ID 10?',
			a: ['vlan 10 name SALES', 'vlan 10; name SALES', 'create vlan 10 SALES', 'vlan SALES id 10'],
			correct: 1,
			explanation: 'The correct sequence is: vlan 10, then name SALES in VLAN configuration mode.'
		},
		{
			q: 'Which command assigns an access port to VLAN 20?',
			a: ['switchport vlan 20', 'switchport access vlan 20', 'vlan access 20', 'access vlan 20'],
			correct: 1,
			explanation: 'switchport access vlan 20 assigns an access port to VLAN 20.'
		},
		{
			q: 'What command configures a trunk port?',
			a: ['switchport trunk', 'switchport mode trunk', 'trunk mode on', 'port trunk enable'],
			correct: 1,
			explanation: 'switchport mode trunk configures an interface as a trunk port.'
		},
		{
			q: 'What is required for inter-VLAN communication?',
			a: ['Larger switches', 'Routing capability', 'More VLANs', 'Trunk ports only'],
			correct: 1,
			explanation: 'Routing capability (router or Layer 3 switch) is required for inter-VLAN communication.'
		},
		{
			q: 'Which command shows VLAN assignments?',
			a: ['show vlan', 'show vlan brief', 'display vlan', 'list vlans'],
			correct: 1,
			explanation: 'show vlan brief displays a summary of VLANs and their port assignments.'
		},
		{
			q: 'What is a security best practice for native VLANs?',
			a: ['Use VLAN 1', 'Use an unused VLAN', 'Disable native VLAN', 'Use the highest VLAN ID'],
			correct: 1,
			explanation: 'Use an unused VLAN (like VLAN 99) as the native VLAN to improve security.'
		}
	];

	let currentQ = 0;
	const userAnswers = new Array(quiz.length).fill(-1);
	const quizRoot = document.getElementById('quizRoot');

	function renderQuestion(index) {
		if (!quizRoot) return;
		
		quizRoot.innerHTML = '';
		const item = quiz[index];
		
		const qEl = document.createElement('div');
		qEl.className = 'quiz-question';
		qEl.innerHTML = `
			<div class="quiz-header">
				<h4>Question ${index + 1} of ${quiz.length}</h4>
				<div class="quiz-progress">
					<div class="quiz-progress-bar" style="width: ${((index + 1) / quiz.length) * 100}%"></div>
				</div>
			</div>
			<h3>${item.q}</h3>
		`;
		
		const optionsList = document.createElement('div');
		optionsList.className = 'quiz-options';
		
		item.a.forEach((opt, idx) => {
			const button = document.createElement('button');
			button.className = 'btn small quiz-option';
			button.textContent = opt;
			button.dataset.index = idx;
			
			// Show previous selection
			if (userAnswers[index] === idx) {
				button.classList.add('selected');
			}
			
			button.addEventListener('click', () => {
				// Clear previous selection
				optionsList.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
				button.classList.add('selected');
				userAnswers[index] = idx;
			});
			
			optionsList.appendChild(button);
		});
		
		qEl.appendChild(optionsList);
		quizRoot.appendChild(qEl);
		
		// Add CSS for quiz progress bar
		if (!document.querySelector('#quiz-progress-styles')) {
			const style = document.createElement('style');
			style.id = 'quiz-progress-styles';
			style.textContent = `
				.quiz-header { margin-bottom: 20px; }
				.quiz-progress { 
					width: 100%; 
					height: 4px; 
					background: rgba(255,255,255,0.1); 
					border-radius: 2px; 
					overflow: hidden; 
					margin-top: 8px;
				}
				.quiz-progress-bar { 
					height: 100%; 
					background: linear-gradient(90deg, var(--accent), var(--accent-2)); 
					transition: width 300ms ease;
				}
				.quiz-options { 
					display: grid; 
					gap: 8px; 
					margin-top: 16px; 
				}
				.quiz-option {
					text-align: left;
					padding: 12px;
					justify-content: flex-start;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// Quiz navigation
	document.getElementById('nextQ')?.addEventListener('click', () => {
		if (currentQ < quiz.length - 1) {
			currentQ++;
			renderQuestion(currentQ);
		}
	});

	document.getElementById('prevQ')?.addEventListener('click', () => {
		if (currentQ > 0) {
			currentQ--;
			renderQuestion(currentQ);
		}
	});

	// Quiz submission
	document.getElementById('submitQuiz')?.addEventListener('click', () => {
		let score = 0;
		let detailedResults = [];
		
		quiz.forEach((question, index) => {
			const userAnswer = userAnswers[index];
			const isCorrect = userAnswer === question.correct;
			if (isCorrect) score++;
			
			detailedResults.push({
				question: question.q,
				userAnswer: userAnswer >= 0 ? question.a[userAnswer] : 'No answer',
				correctAnswer: question.a[question.correct],
				isCorrect: isCorrect,
				explanation: question.explanation
			});
		});
		
		const percentage = Math.round((score / quiz.length) * 100);
		const result = document.getElementById('quizResult');
		
		let resultHTML = `
			<div class="quiz-final-result">
				<h3>Quiz Complete!</h3>
				<div class="score-display">
					<div class="score-circle">
						<span class="score-number">${percentage}%</span>
						<span class="score-fraction">${score}/${quiz.length}</span>
					</div>
				</div>
		`;
		
		if (percentage >= 80) {
			resultHTML += `<p style="color: #10b981;">🎉 Excellent work! You have mastered VLAN concepts!</p>`;
			completedLessons.add(10); // Mark final lesson as completed
		} else if (percentage >= 60) {
			resultHTML += `<p style="color: #f59e0b;">📚 Good effort! Review the lessons and try again to improve your score.</p>`;
		} else {
			resultHTML += `<p style="color: #ef4444;">📖 Keep studying! Review the tutorial lessons and retake the quiz.</p>`;
		}
		
		resultHTML += `</div>`;
		result.innerHTML = resultHTML;
		
		// Add detailed results
		const detailsEl = document.createElement('details');
		detailsEl.innerHTML = `
			<summary style="margin: 16px 0; cursor: pointer; color: var(--accent);">View Detailed Results</summary>
			<div class="detailed-results">
				${detailedResults.map((item, index) => `
					<div class="result-item ${item.isCorrect ? 'correct' : 'incorrect'}">
						<h4>Question ${index + 1}: ${item.isCorrect ? '✅' : '❌'}</h4>
						<p><strong>Q:</strong> ${item.question}</p>
						<p><strong>Your answer:</strong> ${item.userAnswer}</p>
						<p><strong>Correct answer:</strong> ${item.correctAnswer}</p>
						<p><em>${item.explanation}</em></p>
					</div>
				`).join('')}
			</div>
		`;
		result.appendChild(detailsEl);
		
		updateProgress();
		
		// Add CSS for quiz results
		if (!document.querySelector('#quiz-result-styles')) {
			const style = document.createElement('style');
			style.id = 'quiz-result-styles';
			style.textContent = `
				.quiz-final-result { text-align: center; }
				.score-display { margin: 20px 0; }
				.score-circle { 
					display: inline-block; 
					width: 120px; 
					height: 120px; 
					border-radius: 50%; 
					background: linear-gradient(135deg, var(--accent), var(--accent-2)); 
					display: flex; 
					flex-direction: column; 
					align-items: center; 
					justify-content: center; 
					color: #0a1628; 
					font-weight: bold;
				}
				.score-number { font-size: 24px; }
				.score-fraction { font-size: 14px; opacity: 0.8; }
				.detailed-results { margin-top: 16px; }
				.result-item { 
					margin: 12px 0; 
					padding: 16px; 
					border-radius: 8px; 
					border-left: 4px solid; 
				}
				.result-item.correct { 
					background: rgba(16,185,129,0.1); 
					border-left-color: #10b981; 
				}
				.result-item.incorrect { 
					background: rgba(239,68,68,0.1); 
					border-left-color: #ef4444; 
				}
			`;
			document.head.appendChild(style);
		}
	});

	// Initialize the tutorial
	setupScrollListener();
	setupLessonObserver();
	
	if (quizRoot) {
		renderQuestion(0);
	}

	// Ensure proper initialization after page load
	window.addEventListener('load', () => {
		setTimeout(() => {
			updateScrollProgress();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}, 200);
	});

	// Keyboard navigation for lessons
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			const nextLesson = document.getElementById(`lesson${Math.min(currentLessonInView + 1, totalLessons)}`);
			if (nextLesson) {
				nextLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			const prevLesson = document.getElementById(`lesson${Math.max(currentLessonInView - 1, 1)}`);
			if (prevLesson) {
				prevLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	});

})();

