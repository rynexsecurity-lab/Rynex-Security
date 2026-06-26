const form = document.getElementById('contactForm');

if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    const web3FormsAccessKey = form.dataset.web3FormsAccessKey;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const originalText = submitBtn.textContent;
        let web3FormsError = null;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        if (formStatus) {
            formStatus.textContent = '';
        }

        try {
            if (web3FormsAccessKey) {
                try {
                    const web3FormsData = new FormData(form);
                    web3FormsData.set('access_key', web3FormsAccessKey);

                    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: web3FormsData
                    });

                    const web3FormsResult = await web3FormsResponse.json().catch(() => ({}));

                    if (!web3FormsResponse.ok || !web3FormsResult.success) {
                        web3FormsError = new Error(web3FormsResult.message || 'Web3Forms could not process the submission.');
                        console.error('Web3Forms submission failed:', web3FormsError.message);
                    }
                } catch (error) {
                    web3FormsError = error;
                    console.error('Web3Forms submission failed:', error.message);
                }
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                form.reset();

                if (formStatus) {
                    formStatus.textContent = data.message || 'Message sent successfully. We will contact you shortly.';
                    formStatus.style.color = '#00ffcc';
                    if (web3FormsError) {
                        formStatus.textContent += ' Web3Forms inbox sync also needs attention.';
                    }
                }
            } else {
                if (formStatus) {
                    formStatus.textContent = data.message || 'Message could not be sent. Please try again.';
                    formStatus.style.color = '#ff6b6b';
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = error.message || 'Network error while sending the message. Please try again.';
                formStatus.style.color = '#ff6b6b';
            }
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
