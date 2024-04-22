import { useEffect, useState } from "react";

import styles from './ReposList.module.css';

const ReposList = ({ nomeUsuario }) => {
    const [repos, setRepos] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [deuErro, setDeuErro] = useState(false);

    useEffect(() => {
        setDeuErro(false);
        setEstaCarregando(true);
        fetch(`https://api.github.com/users/${nomeUsuario}/repos`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Usuário não encontrado');
                    } else {
                        throw new Error('Erro desconhecido');
                    }
                }
                return res.json();
            })
            .then(resJson => {
                setEstaCarregando(false);
                setRepos(resJson);
            })
            .catch(error => {
                console.error('Erro ao buscar repositórios:', error.message);
                setEstaCarregando(false); // Se ocorrer um erro, não está mais carregando
                setDeuErro(true); // Configurar deuErro como verdadeiro
            });
    }, [nomeUsuario]);
    

    return (
        <div className="container">
            {estaCarregando ? (
                <h1>Carregando........</h1>
            ) : deuErro ? (
                <h1>Usuário não encontrado</h1>
            ) : (
                <ul className={styles.list}>
                    {repos.map(({ id, name, language, html_url }) => (
                        <li className={styles.listItem} key={id}>
                            <div className={styles.itemName}>
                                <b>Nome: </b> {name}
                            </div>
                            <div className={styles.itemLanguage}>
                                <b>Linguagem: </b> {language}
                            </div>
                            <div className={styles.itemLink}>
                                <a target="_blank" href={html_url}>Visitar no Github</a>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ReposList;
