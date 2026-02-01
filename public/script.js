const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    const loadingId = addMessage('Gemini sedang mengetik...', 'bot');

    try {
       
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversation: [{ role: 'user', text: message }]
            })
        });

        const data = await response.json();
        updateMessage(loadingId, data.result || "Maaf, tidak ada balasan.");
        
    } catch (error) {
        console.error(error);
        updateMessage(loadingId, "Error: Gagal terhubung ke server.");
    }
});

function addMessage(text, sender) {
    const div = document.createElement('div');
    const id = Math.random().toString(36).substr(2, 9);
    div.id = id;
    div.classList.add('message', sender);
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function updateMessage(id, newText) {
    const msg = document.getElementById(id);
    if (msg) {
        msg.innerText = newText;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}