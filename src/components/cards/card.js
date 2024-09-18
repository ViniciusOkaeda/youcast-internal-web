import React from "react";

import './card.css'

let infoEvolucao = [
    { totalCustomers: 1500, empresasAtivas: 360, receita: 1000000, evolucao: 15 },
  ];

const Card = () => {


    return(
        <div className="cardContainer">

            {infoEvolucao.map((info, idx) => {

                return(
                    <>
                    <div key={idx} className="cardContent">
                        <div className="cardContentFlex"> 
                            <div className="cardDetailContainer">
                                <h5>Total Customers</h5>
                                <h2>{info.totalCustomers}</h2>
                            </div>

                            <div className="cardIconContainer">


                            </div>
                        </div>
                    </div>

                    <div className="cardContent">
                        <div className="cardContentFlex"> 
                            <div className="cardDetailContainer">
                                <h5>Empresas Ativas</h5>
                                <h2>{info.empresasAtivas}</h2>
                            </div>

                            <div className="cardIconContainer">


                            </div>
                        </div>
                    </div>
                    <div className="cardContent">
                        <div className="cardContentFlex"> 
                            <div className="cardDetailContainer">
                                <h5>Total Faturado</h5>
                                <h2>RS: {info.receita}</h2>
                            </div>

                            <div className="cardIconContainer">


                            </div>
                        </div>
                    </div>
                    <div className="cardContent">
                        <div className="cardContentFlex"> 
                            <div className="cardDetailContainer">
                                <h5>Evolução</h5>
                                <h2>{info.evolucao}% </h2>
                            </div>

                            <div className="cardIconContainer">


                            </div>
                        </div>
                    </div>
                    </>
                )
            })}
        </div>
    )
}

export {Card}

