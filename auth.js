document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            alert('로그인되었습니다!');
            window.location.href = '../index.html';
        })
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
            const passwordConfirm = registerForm.querySelectorAll('input[type="password"]')[1].value;

            if (password !== passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            alert('회원가입이 완료되었습니다!');
            window.location.href = '../index.html';
        });
    }
}); 