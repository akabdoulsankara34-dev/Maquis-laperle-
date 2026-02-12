// SCANNER QR - VERSION 100% TÉLÉPHONE
(function() {
    if (!document.body) return;
    if (window.SCANNER_ACTIF) return;
    window.SCANNER_ACTIF = true;
    
    function demarrer() {
        if (document.getElementById('scanner-widget')) return;
        
        const widget = document.createElement('div');
        widget.id = 'scanner-widget';
        widget.style.cssText = 'position:fixed; bottom:20px; left:10px; right:10px; margin:0 auto; max-width:350px; z-index:999999;';
        
        widget.innerHTML = `
            <div style="background:#4361ee; color:white; padding:15px; border-radius:15px; text-align:center; box-shadow:0 5px 20px rgba(0,0,0,0.3);">
                <div style="font-size:20px; margin-bottom:5px;">📷 SCAN QR</div>
                <div style="font-size:12px; opacity:0.9; margin-bottom:15px;">Redirection automatique</div>
                <button id="scan-btn" style="background:white; color:#4361ee; border:none; padding:12px 20px; border-radius:30px; font-weight:bold; width:100%; font-size:16px; cursor:pointer;">
                    📱 ACTIVER CAMÉRA
                </button>
                <div id="scan-status" style="margin-top:10px; font-size:12px; display:none;"></div>
                <video id="scan-video" style="width:100%; border-radius:10px; margin-top:10px; display:none;"></video>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        document.getElementById('scan-btn').onclick = function() {
            this.style.display = 'none';
            document.getElementById('scan-video').style.display = 'block';
            document.getElementById('scan-status').style.display = 'block';
            document.getElementById('scan-status').innerHTML = '⏳ Chargement...';
            chargerScanner();
        };
    }
    
    function chargerScanner() {
        if (typeof Instascan === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/instascan/1.0.0/instascan.min.js';
            script.onload = initScan;
            script.onerror = function() {
                document.getElementById('scan-status').innerHTML = '❌ Erreur chargement scanner';
            };
            document.head.appendChild(script);
        } else {
            initScan();
        }
    }
    
    function initScan() {
        const video = document.getElementById('scan-video');
        const status = document.getElementById('scan-status');
        
        Instascan.Camera.getCameras().then(cameras => {
            if (cameras.length === 0) {
                status.innerHTML = '❌ Aucune caméra détectée';
                return;
            }
            
            const scanner = new Instascan.Scanner({ video, scanPeriod: 2 });
            scanner.addListener('scan', url => {
                if (url && url.startsWith('http')) {
                    status.innerHTML = '✅ Redirection...';
                    window.location.href = url;
                }
            });
            
            // Utiliser la caméra arrière (dernière caméra disponible)
            scanner.start(cameras[cameras.length - 1]);
            status.innerHTML = '✅ Scannez un QR code';
        }).catch(err => {
            console.error('Erreur caméra:', err);
            status.innerHTML = '❌ Permission caméra refusée';
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', demarrer);
    } else {
        demarrer();
    }
})();
