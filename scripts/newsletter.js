/**
 * Classe responsável pela gestão, validação e submissão da subscrição da newsletter.
 * Utiliza o módulo central db.js para a persistência de dados.
 */

import { addRecord, STORE_NEWSLETTER } from './db.js';

export class GestorNewsletter {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.campos = Array.from(document.querySelectorAll('#newsletter-form input'));
        
        this.config = {
            corValido: "4px solid #4CAF50",
            corInvalido: "4px solid #ff4d4d"
        };
    }

    iniciar() {
        if (!this.form) return;
        this.campos.forEach(campo => {
            campo.addEventListener('input', () => this.atualizarEstiloVisual(campo));
        });
        this.form.addEventListener('submit', (e) => this.validarSubmissao(e));
    }

    validarCampo(elemento) {
        const valor = elemento.value.trim();
        if (valor === "") return false;
        if (elemento.id === 'news-name') return valor.length >= 3;
        if (elemento.id === 'news-email') {
            const regexEmail = /^[^\s@]+@(uac\.pt|gmail\.com|outlook\.com)$/i;
            return regexEmail.test(valor);
        }
        return elemento.checkValidity();
    }

    atualizarEstiloVisual(elemento) {
        if (elemento.value.trim() === "") {
            elemento.style.borderRight = "none";
            return;
        }
        elemento.style.borderRight = this.validarCampo(elemento) 
            ? this.config.corValido 
            : this.config.corInvalido;
    }

    validarSubmissao(e) {
        e.preventDefault();
        const nomeEl = document.getElementById('news-name');
        const emailEl = document.getElementById('news-email');

        if (!this.validarCampo(nomeEl)) {
            alert("Por favor, introduza um nome válido.");
            nomeEl.focus(); return;
        }
        if (!this.validarCampo(emailEl)) {
            alert("Email inválido. Apenas domínios @uac.pt, @gmail.com ou @outlook.com.");
            emailEl.focus(); return;
        }

        if (confirm(`Deseja subscrever a newsletter com o email ${emailEl.value}?`)) {
            const novoSubscritor = {
                nome: nomeEl.value.trim(),
                email: emailEl.value.trim().toLowerCase(),
                dataSubscricao: new Date().toISOString()
            };
            this.guardarSubscritor(novoSubscritor);
        }
    }

    async guardarSubscritor(subscritor) {
        try {
            await addRecord(STORE_NEWSLETTER, subscritor);
            alert('Subscrição realizada com sucesso!');
            this.form.reset(); 
            this.campos.forEach(campo => campo.style.borderRight = "none");
        } catch (error) {
            if (error.name === 'ConstraintError') {
                alert('Este endereço de email já se encontra subscrito!');
            } else {
                console.error(error);
                alert('Ocorreu um erro ao processar a sua subscrição.');
            }
        }
    }
}