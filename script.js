var board, body,options,horse,count=0,choice;
            var l = [],chance=0,pos=[];
            var optionsList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
            var ops = [[1,2],[2,1],[-1,2],[2,-1],[-2,1],[1,-2],[-1,-2],[-2,-1]];
            for (let i = 0; i < 8; i++) {
                l.push([0,0,0,0,0,0,0,0]);
            }

            window.onload = function() {
                choice = document.getElementById("choice");
                board = document.getElementById("board");
                body = document.getElementsByTagName("body")[0];
                options = document.getElementsByClassName("options");
                board.style.height=board.style.width=Math.min(body.offsetHeight, body.offsetWidth)-10+"px";
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        board.innerHTML+=`<div class = "block" style="top:${i*12.5}%;left:${j*12.5}%;background-color:${(i+j)%2==1?"darkgreen":"white"};"></div>`
                    }
                    board.innerHTML+=`<div class = "options" onclick = "MoveHorse(${i});"></div>`;
                }
                let x = Math.floor(Math.random()*2)+3,y=Math.floor(Math.random()*2)+3;
                horse = document.getElementById("horse");
                horse.style.top = y*12.5+"%";
                horse.style.left = x*12.5+"%";
                l[y][x]=2;
                pos=[x,y];
            }

            window.Choose = function(c) {
                choice.style.top="100vh";
                if (c) {AI();} else {ShowOptions();}
            }

            window.ShowOptions = function() {
                let n = 0
                for (let i = 0; i < 8; i++) {
                    let a = pos[0]+ops[i][0], b = pos[1]+ops[i][1];
                    if (a>-1 && a<8 && b>-1 && b<8 && l[b][a]!=3) {
                        l[b][a]=1;
                        n++;
                    }
                }
                if (n==0) {ShowFinalPage("AI WON");}
                UseInfo();
            }

            window.MoveHorse = function(n) {
                //console.log(optionsList[n]);
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (l[i][j]==1 || l[i][j]==2) {
                            l[i][j]=0;
                        }
                    }
                }
                let initial = [...pos];
                l[pos[1]][pos[0]]=3;
                AddUsed(pos);
                pos = optionsList[n];
                l[pos[1]][pos[0]]=2;
                UseInfo(initial);
                AI();
            }

            function AddUsed(x) {
                board.innerHTML+=`<div class = "used" style="top:${x[1]*12.5}%;left:${x[0]*12.5}%;"></div>`;
            }

            function UseInfo(initial=null) {
                let n = 0;
                for (let i = 0; i < 8; i++) {
                    options[i].style.display = "none";
                }
                //console.log(pos);
                horse = document.getElementById("horse");
                // horse.style.left = pos[0]*12.5+"%";
                // horse.style.top = pos[1]*12.5+"%";
                if (initial!=null) {
                    ShowAnimations(initial, pos);
                }
                setTimeout(function() {
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if (l[i][j]==1) {
                                optionsList[n] = [j,i];
                                options[n].style.display = "block";
                                options[n].style.left = j*12.5+"%";
                                options[n++].style.top = i*12.5+"%";
                            }
                        }
                    }
                },470);
            }

            function ShowAnimations(initial, final) {
                //console.log(final);
                let a=(Math.abs(initial[1]-final[1]) > Math.abs(initial[0]-final[0]) ? 1 : 0);
                let b = (a+1)%2;
                let l = (a==1 ? ["top","left"] : ["left", "top"])
                setTimeout(function() {horse.style[l[0]] = (final[a]+initial[a])/2*12.5+"%";},20);
                setTimeout(function() {horse.style[l[0]] = final[a]*12.5+"%";},170);
                setTimeout(function() {horse.style[l[1]] = final[b]*12.5+"%";},320);
            }

            function AI() {
                setTimeout(function() {
                    let initial=[...pos];
                    l[pos[1]][pos[0]]=3;
                    AddUsed(pos);
                    var move = [(pos[0]%2 ? pos[0]-1 : pos[0]+1), pos[1]%4<2 ? pos[1]+2 : pos[1]-2];
                    if (l[move[1]][move[0]]==3) {
                        let ok = [];
                        for (let i = 0; i < 8; i++) {
                            let a = pos[0]+ops[i][0],b = pos[1]+ops[i][1];
                            if (a>=0 && a<8 && b>=0 && b<8 && l[b][a]!=3) {
                                ok.push([a,b]);
                            }
                        }
                        if (ok.length == 0) {
                            ShowFinalPage("YOU WON");
                            return;
                        }
                        else {
                            pos = ok[Math.floor(Math.random()*ok.length)];
                        }
                    }
                    else {
                        pos=move;
                    }
                    l[pos[1]][pos[0]] = 2;
                    UseInfo(initial);
                    ShowOptions();
                },1000);
            }

            function ShowFinalPage(msg) {
                choice.style.top = "0";
                choice.innerHTML = `<div id = "final">${msg}</div>`;
            }