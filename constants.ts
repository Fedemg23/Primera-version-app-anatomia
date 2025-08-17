import React from 'react';
import { 
    LevelReward, Avatar, ShopItem, Achievement, DailyChallenge,
    QuestionData, UserData, NavigationRegion, AIOpponent, BibliographyEntry, UserNote
} from './types';
import { BrainCircuit, IconMusclesAnimated, IconBonesAnimated, IconVascularAnimated, IconCavitiesAnimated, IconIntestine, UserCircle, Brain, Heart, IconInnervationAnimated, IconTopographicAnimated, Gift, ChevronsUp, Shield, Zap, Eraser, Split, Lightbulb, Undo2, Swords, ListCheck } from './components/icons';
import { imageAvatars } from './src/avatarLoader';

// ==========================================================================================
// METADATA PARA LA GENERACIÓN DINÁMICA DE LA UI
// Contiene información visual que no puede derivarse de las preguntas.
// ==========================================================================================

export const regionMetaData: { [key: string]: { name: string; description: string; visuals: { gradient: string; } } } = {
    'miembro-superior': { name: 'Miembro Superior', description: "Hombro, brazo, antebrazo y mano.", visuals: { gradient: 'from-blue-900/80 to-slate-950' } },
    'miembro-inferior': { name: 'Miembro Inferior', description: "Cadera, muslo, pierna y pie.", visuals: { gradient: 'from-emerald-900/80 to-slate-950' } },
    'cabeza-cuello': { name: 'Cabeza y Cuello', description: "Cráneo, cara, laringe y estructuras cervicales.", visuals: { gradient: 'from-purple-900/80 to-slate-950' } },
    'torax': { name: 'Tórax', description: "Caja torácica, corazón, pulmones y mediastino.", visuals: { gradient: 'from-rose-900/80 to-slate-950' } },
    'abdomen': { name: 'Abdomen', description: "Paredes, peritoneo, órganos digestivos y retroperitoneo.", visuals: { gradient: 'from-orange-900/80 to-slate-950' } },
    'pelvis-perine': { name: 'Pelvis y Periné', description: "Estructuras óseas, órganos urogenitales y recto.", visuals: { gradient: 'from-pink-900/80 to-slate-950' } },
    'neuroanatomia': { name: 'Neuroanatomía', description: "Cerebro, médula y nervios periféricos.", visuals: { gradient: 'from-indigo-900/80 to-slate-950' } },
};

// ==========================================================================================
// BANCO DE PREGUNTAS CENTRALIZADO E GRANULAR
// Esta es la única fuente de verdad para el contenido de los quizzes.
// ==========================================================================================

export const questionBank: QuestionData[] = [
    // --- NUEVA ESTRUCTURA DE MIEMBRO SUPERIOR ---

    // Tema: Huesos
    { id: 'ms_h_cla_1', textoPregunta: '¿Con qué estructura se articula el extremo acromial de la clavícula?', opciones: ['Esternón', 'Acromion de la escápula', 'Apófisis coracoides', 'Primera costilla'], indiceRespuestaCorrecta: 1, explicacion: 'El extremo acromial (lateral) de la clavícula se articula con el acromion de la escápula, formando la articulación acromioclavicular, que es una articulación sinovial plana. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Fácil' },
    { id: 'ms_h_esc_1', textoPregunta: '¿Qué parte de la escápula se articula con la cabeza del húmero?', opciones: ['Acromion', 'Cavidad glenoidea', 'Fosa subescapular', 'Espina'], indiceRespuestaCorrecta: 1, explicacion: 'La cavidad glenoidea es una fosa poco profunda en el ángulo lateral de la escápula que recibe la cabeza del húmero para formar la articulación glenohumeral (del hombro). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Fácil' },
    { id: 'ms_h_hum_1', textoPregunta: 'Una fractura del cuello quirúrgico del húmero pone en riesgo a qué nervio?', opciones: ['Nervio Mediano', 'Nervio Radial', 'Nervio Axilar', 'Nervio Musculocutáneo'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio axilar, junto con la arteria circunfleja humeral posterior, rodea el cuello quirúrgico del húmero, por lo que es vulnerable en fracturas de esta zona. Una lesión de este nervio puede causar parálisis del músculo deltoides y pérdida de la sensibilidad en la piel que lo recubre. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Difícil' },
    { id: 'ms_h_rad_1', textoPregunta: 'La cabeza del radio se articula con qué parte del húmero?', opciones: ['Tróclea', 'Capítulo (Cóndilo)', 'Fosa olecraneana', 'Epicóndilo medial'], indiceRespuestaCorrecta: 1, explicacion: 'La cabeza del radio, con su fóvea articular, se articula con el capítulo (o cóndilo) del húmero. La tróclea, en cambio, se articula con la ulna (cúbito). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Media' },
    { id: 'ms_h_uln_1', textoPregunta: 'El olécranon, que forma la prominencia del codo, es parte de qué hueso?', opciones: ['Radio', 'Húmero', 'Ulna (Cúbito)', 'Escápula'], indiceRespuestaCorrecta: 2, explicacion: 'El olécranon es una gran apófisis en el extremo proximal de la ulna que se articula con la fosa olecraneana del húmero durante la extensión del codo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_1', textoPregunta: '¿Cuál es el hueso del carpo que se fractura con más frecuencia?', opciones: ['Semilunar', 'Ganchoso', 'Escafoides', 'Piramidal'], indiceRespuestaCorrecta: 2, explicacion: 'El escafoides es el hueso carpiano que se fractura más comúnmente, a menudo por una caída sobre la mano extendida. Su irrigación retrógrada lo hace propenso a la necrosis avascular. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_met_1', textoPregunta: '¿Cuántos huesos metacarpianos hay en cada mano?', opciones: ['4', '5', '7', '8'], indiceRespuestaCorrecta: 1, explicacion: 'Hay 5 huesos metacarpianos en cada mano, numerados del 1 (pulgar) al 5 (meñique). Forman el esqueleto de la palma de la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_fal_1', textoPregunta: 'A diferencia de los otros dedos, ¿cuántas falanges tiene el pulgar?', opciones: ['Una', 'Dos', 'Tres', 'Ninguna'], indiceRespuestaCorrecta: 1, explicacion: 'El pulgar (primer dedo) solo tiene dos falanges: proximal y distal. Los otros cuatro dedos tienen tres (proximal, media y distal), lo que les da una articulación adicional. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Fácil' },
    { id: 'ms_ar_ac_1', textoPregunta: '¿Qué tipo de articulación sinovial es la acromioclavicular?', opciones: ['Esférica', 'Bisagra', 'Plana', 'Pivote'], indiceRespuestaCorrecta: 2, explicacion: 'La articulación acromioclavicular es una articulación sinovial plana (artrodia) que permite movimientos de deslizamiento y rotación de la escápula. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Acromioclavicular' }, dificultad: 'Media' },
    { id: 'ms_ar_gh_1', textoPregunta: '¿Qué estructura de fibrocartílago aumenta la profundidad de la cavidad glenoidea para estabilizar el hombro?', opciones: ['Menisco', 'Disco articular', 'Labrum glenoideo', 'Ligamento coracoacromial'], indiceRespuestaCorrecta: 2, explicacion: 'El labrum glenoideo es un anillo de fibrocartílago que aumenta la concavidad de la fosa glenoidea. Su lesión, conocida como lesión de SLAP, es común en atletas de lanzamiento. La estabilidad también es proporcionada activamente por los músculos del manguito rotador. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Glenohumeral' }, dificultad: 'Media' },
    { id: 'ms_ar_hr_1', textoPregunta: 'La articulación humeroradial está implicada en los movimientos de:', opciones: ['Flexo-extensión y pronosupinación', 'Solo flexo-extensión', 'Solo pronosupinación', 'Abducción y aducción'], indiceRespuestaCorrecta: 0, explicacion: 'La articulación humeroradial, entre el capítulo y la cabeza del radio, participa tanto en la flexo-extensión del codo como en la rotación del radio durante la pronosupinación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Humeroradial' }, dificultad: 'Media' },
    { id: 'ms_ar_hc_1', textoPregunta: 'La articulación humerocubital es un ejemplo clásico de articulación tipo:', opciones: ['Pivote', 'Plana', 'Silla de montar', 'Bisagra (Gínglimo)'], indiceRespuestaCorrecta: 3, explicacion: 'La articulación entre la tróclea del húmero y la escotadura troclear de la ulna funciona como una bisagra (gínglimo), permitiendo principalmente la flexión y extensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Humerocubital' }, dificultad: 'Fácil' },
    { id: 'ms_ar_rcp_1', textoPregunta: 'El movimiento de pronosupinación del antebrazo ocurre en las articulaciones radiocubitales proximal y ____.', opciones: ['distal', 'media', 'superior', 'inferior'], indiceRespuestaCorrecta: 0, explicacion: 'La pronación y supinación son posibles gracias a la acción coordinada de las articulaciones radiocubital proximal y distal, que funcionan como un solo eje de tipo pivote. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Radiocubital proximal' }, dificultad: 'Fácil' },
    { id: 'ms_ar_rcd_1', textoPregunta: '¿Qué tipo de articulación es la radiocubital distal?', opciones: ['Bisagra', 'Pivote (Trocoide)', 'Esférica', 'Plana'], indiceRespuestaCorrecta: 1, explicacion: 'La articulación radiocubital distal es una articulación sinovial de tipo pivote (trocoide), que permite al radio rotar alrededor de la cabeza de la ulna. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Radiocubital distal' }, dificultad: 'Media' },
    { id: 'ms_ar_rca_1', textoPregunta: 'La articulación radiocarpiana (muñeca) se forma entre el radio y la fila proximal de los huesos del carpo, excepto el:', opciones: ['Escafoides', 'Semilunar', 'Piramidal', 'Pisiforme'], indiceRespuestaCorrecta: 3, explicacion: 'El pisiforme no participa directamente en la articulación radiocarpiana; actúa más como un hueso sesamoideo dentro del tendón del flexor cubital del carpo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Radiocarpiana' }, dificultad: 'Difícil' },
    { id: 'ms_ar_mc_1', textoPregunta: '¿Dónde se encuentra la articulación mediocarpiana?', opciones: ['Entre el radio y el carpo', 'Entre el cúbito y el carpo', 'Entre las filas proximal y distal del carpo', 'Entre el carpo y los metacarpianos'], indiceRespuestaCorrecta: 2, explicacion: 'La articulación mediocarpiana es la articulación compleja que se encuentra entre la primera (escafoides, semilunar, piramidal) y la segunda fila (trapecio, trapezoide, grande, ganchoso) de los huesos del carpo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Mediocarpiana' }, dificultad: 'Media' },
    { id: 'ms_ar_cmc_1', textoPregunta: 'La articulación carpometacarpiana del pulgar es de tipo "silla de montar", lo que permite el movimiento de:', opciones: ['Oposición', 'Solo flexión', 'Solo abducción', 'Rotación axial'], indiceRespuestaCorrecta: 0, explicacion: 'Su forma única de silla de montar (selar) entre el trapecio y el primer metacarpiano es crucial para permitir la oposición del pulgar, un movimiento fundamental para la prensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Carpometacarpiana' }, dificultad: 'Media' },
    { id: 'ms_ar_imc_1', textoPregunta: 'Las articulaciones intermetacarpianas se encuentran entre:', opciones: ['El carpo y los metacarpianos', 'Las bases de los metacarpianos adyacentes', 'Los metacarpianos y las falanges', 'Las falanges proximales'], indiceRespuestaCorrecta: 1, explicacion: 'Son articulaciones planas que se encuentran entre las bases de los huesos metacarpianos del segundo al quinto dedo, permitiendo un ligero deslizamiento que contribuye a la concavidad de la palma. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Intermetacarpiana' }, dificultad: 'Media' },
    { id: 'ms_ar_mf_1', textoPregunta: 'Las articulaciones metacarpofalángicas (nudillos) permiten los movimientos de flexión/extensión y...?', opciones: ['Rotación', 'Pronosupinación', 'Abducción/aducción', 'Inversión/eversión'], indiceRespuestaCorrecta: 2, explicacion: 'Estas articulaciones condíleas (elipsoideas) permiten doblar/estirar los dedos (flexo-extensión) y separarlos/juntarlos (abducción/aducción). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Metacarpofalángica' }, dificultad: 'Fácil' },
    { id: 'ms_ar_ifp_1', textoPregunta: '¿Qué tipo de articulaciones son las interfalángicas (proximal y distal)?', opciones: ['Esféricas', 'Planas', 'Bisagra', 'Pivote'], indiceRespuestaCorrecta: 2, explicacion: 'Las articulaciones interfalángicas son articulaciones de bisagra (gínglimo) que solo permiten la flexión y la extensión en un único plano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Interfalángica proximal' }, dificultad: 'Fácil' },
    { id: 'ms_ar_ifd_1', textoPregunta: 'La articulación interfalángica distal se encuentra entre la falange media y la falange...', opciones: ['Proximal', 'Distal', 'Metacarpiana', 'Capitata'], indiceRespuestaCorrecta: 1, explicacion: 'Como su nombre indica, la articulación interfalángica distal es la articulación más alejada en el dedo, situada entre las falanges media y distal. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Articulaciones', subtema: 'Interfalángica distal' }, dificultad: 'Fácil' },
    { id: 'ms_m_sup_1', textoPregunta: '¿Qué músculo del manguito rotador es responsable de iniciar la abducción del brazo?', opciones: ['Infraespinoso', 'Subescapular', 'Supraespinoso', 'Redondo menor'], indiceRespuestaCorrecta: 2, explicacion: 'El supraespinoso inicia los primeros 15-20 grados de abducción del brazo, un movimiento que luego es continuado por el deltoides. Su tendón es uno de los que más sufre en el síndrome de pinzamiento subacromial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Supraespinoso (H)' }, dificultad: 'Media' },
    { id: 'ms_m_inf_1', textoPregunta: '¿Cuál es la acción principal del músculo infraespinoso?', opciones: ['Rotación medial del brazo', 'Rotación lateral del brazo', 'Flexión del brazo', 'Abducción del brazo'], indiceRespuestaCorrecta: 1, explicacion: 'Junto con el redondo menor, el infraespinoso es uno de los principales rotadores laterales (externos) del húmero. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Infraespinoso (H)' }, dificultad: 'Media' },
    { id: 'ms_m_rmen_1', textoPregunta: 'El redondo menor es inervado por el nervio:', opciones: ['Axilar', 'Subescapular', 'Radial', 'Musculocutáneo'], indiceRespuestaCorrecta: 0, explicacion: 'El nervio axilar inerva tanto al músculo deltoides como al redondo menor. Esto es clínicamente relevante en luxaciones de hombro que pueden dañar este nervio. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Redondo Menor (H)' }, dificultad: 'Media' },
    { id: 'ms_m_sub_1', textoPregunta: '¿Qué músculo del manguito rotador realiza la rotación medial (interna) del brazo?', opciones: ['Supraespinoso', 'Infraespinoso', 'Subescapular', 'Redondo menor'], indiceRespuestaCorrecta: 2, explicacion: 'El subescapular es el principal rotador medial del húmero y se inserta en el tubérculo menor. Los otros tres músculos del manguito rotador se insertan en el tubérculo mayor. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Subescapular (H)' }, dificultad: 'Media' },
    { id: 'ms_m_rmay_1', textoPregunta: '¿Cuál de estas acciones NO es realizada por el Redondo Mayor?', opciones: ['Aducción del brazo', 'Rotación medial del brazo', 'Extensión del brazo', 'Abducción del brazo'], indiceRespuestaCorrecta: 3, explicacion: 'El redondo mayor es un aductor, rotador medial y extensor del brazo. La abducción (separar el brazo) es la acción opuesta, realizada principalmente por el deltoides y el supraespinoso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Redondo Mayor (H)' }, dificultad: 'Media' },
    { id: 'ms_m_bb_1', textoPregunta: 'Además de flexionar el codo, el bíceps braquial es un potente...', opciones: ['Pronador del antebrazo', 'Supinador del antebrazo', 'Extensor del codo', 'Aductor del brazo'], indiceRespuestaCorrecta: 1, explicacion: 'El bíceps braquial es el supinador más potente del antebrazo, acción crucial para "apretar un tornillo". También es un flexor del codo, aunque el músculo braquial es el flexor primario en todas las posiciones del antebrazo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Bíceps Braquial (B)' }, dificultad: 'Fácil' },
    { id: 'ms_m_cor_1', textoPregunta: '¿Qué nervio perfora característicamente al músculo coracobraquial?', opciones: ['Nervio Mediano', 'Nervio Radial', 'Nervio Musculocutáneo', 'Nervio Axilar'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio musculocutáneo atraviesa el músculo coracobraquial para después inervar a los otros músculos del compartimento anterior del brazo (bíceps y braquial). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Coracobraquial (B)' }, dificultad: 'Media' },
    { id: 'ms_m_tb_1', textoPregunta: 'El músculo tríceps braquial, principal extensor del codo, es inervado por el nervio:', opciones: ['Axilar', 'Radial', 'Mediano', 'Cubital'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio radial proporciona inervación motora a todo el compartimento posterior del brazo y antebrazo, incluyendo las tres cabezas del tríceps. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Tríceps Braquial (B)' }, dificultad: 'Media' },
    { id: 'ms_m_flp_1', textoPregunta: 'El músculo flexor largo del pulgar es inervado por una rama del nervio mediano llamada:', opciones: ['Nervio interóseo posterior', 'Nervio interóseo anterior', 'Nervio cutáneo palmar', 'Nervio recurrente tenar'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio interóseo anterior, rama del mediano, inerva los músculos profundos del compartimento flexor, incluyendo el flexor largo del pulgar y la mitad lateral del flexor profundo de los dedos. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Flexor Largo del pulgar (AB)' }, dificultad: 'Difícil' },
    { id: 'ms_m_ip_1', textoPregunta: 'La acción de los músculos interóseos palmares es la...', opciones: ['Aducción de los dedos (juntarlos)', 'Abducción de los dedos (separarlos)', 'Flexión de los nudillos', 'Extensión de los dedos'], indiceRespuestaCorrecta: 0, explicacion: 'Una mnemotecnia útil es "PAD" (Palmar ADducts): los interóseos palmares aducen o juntan los dedos 2, 4 y 5 hacia el eje de la mano (dedo medio). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Interóseos palmares (M)' }, dificultad: 'Media' },
    { id: 'ms_m_id_1', textoPregunta: 'La acción de los músculos interóseos dorsales es la...', opciones: ['Aducción de los dedos (juntarlos)', 'Abducción de los dedos (separarlos)', 'Oposición del pulgar', 'Flexión de la muñeca'], indiceRespuestaCorrecta: 1, explicacion: 'Una mnemotecnia útil es "DAB" (Dorsal ABducts): los interóseos dorsales abducen o separan los dedos del eje de la mano (dedo medio). Son los únicos que pueden abducir los dedos 2, 3 y 4. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Músculos', subtema: 'Interóseos dorsales (M)' }, dificultad: 'Media' },
    { id: 'ms_i_aa_1', textoPregunta: 'La arteria axilar se convierte en la arteria braquial al pasar el borde inferior del músculo:', opciones: ['Pectoral menor', 'Deltoides', 'Redondo mayor', 'Subescapular'], indiceRespuestaCorrecta: 2, explicacion: 'El borde inferior del músculo redondo mayor marca el punto de transición donde la arteria axilar cambia de nombre a arteria braquial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Irrigación', subtema: 'A. Axilar' }, dificultad: 'Media' },
    { id: 'ms_i_ab_1', textoPregunta: 'En la fosa cubital, la arteria braquial se divide en sus dos ramas terminales, que son las arterias:', opciones: ['Circunflejas humerales', 'Interóseas común y recurrente', 'Radial y cubital', 'Profunda y colateral'], indiceRespuestaCorrecta: 2, explicacion: 'La arteria braquial termina en la fosa del codo, medial al tendón del bíceps, dividiéndose en la arteria radial (lateral) y la arteria cubital (medial). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Irrigación', subtema: 'A. Braquial' }, dificultad: 'Fácil' },
    { id: 'ms_i_ar_1', textoPregunta: 'El pulso arterial en la muñeca se toma comúnmente sobre la arteria:', opciones: ['Cubital', 'Mediana', 'Interósea', 'Radial'], indiceRespuestaCorrecta: 3, explicacion: 'La arteria radial es superficial en la cara anterior de la muñeca, lateral al tendón del flexor radial del carpo, lo que la hace ideal para palpar el pulso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Irrigación', subtema: 'A. Radial' }, dificultad: 'Fácil' },
    { id: 'ms_i_vc_1', textoPregunta: '¿Qué vena superficial importante asciende por la cara lateral del brazo y desemboca en la vena axilar?', opciones: ['Vena Basílica', 'Vena Mediana del codo', 'Vena Cefálica', 'Vena Braquial'], indiceRespuestaCorrecta: 2, explicacion: 'La vena cefálica es la principal vena superficial del lado lateral (radial) del miembro superior y viaja por el surco deltopectoral para unirse a la vena axilar. Es comúnmente utilizada para accesos venosos. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Irrigación', subtema: 'V. Cefálica' }, dificultad: 'Media' },
    { id: 'ms_in_pb_1', textoPregunta: 'Las raíces del plexo braquial están formadas por los ramos anteriores de los nervios espinales:', opciones: ['C1-C4', 'C5-T1', 'L1-L4', 'S1-S4'], indiceRespuestaCorrecta: 1, explicacion: 'El plexo braquial, que inerva el miembro superior, se origina de los ramos anteriores de los nervios espinales de C5, C6, C7, C8 y T1. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'Plexo Braquial' }, dificultad: 'Fácil' },
    { id: 'ms_in_na_1', textoPregunta: 'Una lesión del nervio axilar resultaría en debilidad para la abducción del brazo (después de los primeros 15°) y pérdida de sensibilidad en:', opciones: ['La punta de los dedos', 'La cara medial del antebrazo', 'La piel sobre el músculo deltoides', 'La palma de la mano'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio axilar inerva el deltoides (principal abductor después de los 15°) y el redondo menor, y su rama cutánea da sensibilidad a la piel que recubre el deltoides. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'N. Axilar' }, dificultad: 'Media' },
    { id: 'ms_in_nm_1', textoPregunta: '¿Qué nervio inerva a los músculos del compartimento anterior del brazo (bíceps, braquial, coracobraquial)?', opciones: ['Nervio Mediano', 'Nervio Radial', 'Nervio Musculocutáneo', 'Nervio Axilar'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio musculocutáneo es el responsable de la inervación motora de los flexores del brazo y de la sensibilidad de la cara lateral del antebrazo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'N. Musculocutáneo' }, dificultad: 'Media' },
    { id: 'ms_in_nmed_1', textoPregunta: 'La compresión del nervio mediano en el túnel carpiano afecta principalmente a los músculos:', opciones: ['De la eminencia hipotenar', 'De la eminencia tenar', 'Interóseos', 'Extensores de los dedos'], indiceRespuestaCorrecta: 1, explicacion: 'El síndrome del túnel carpiano causa atrofia y debilidad de los músculos de la eminencia tenar (base del pulgar), inervados por el ramo recurrente del nervio mediano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'N. Mediano' }, dificultad: 'Media' },
    { id: 'ms_in_nrad_1', textoPregunta: 'Una fractura en el tercio medio del húmero (diáfisis) puede lesionar al nervio radial, causando una condición conocida como:', opciones: ['Mano en garra', 'Mano de predicador', 'Mano caída', 'Mano en pinza'], indiceRespuestaCorrecta: 2, explicacion: 'La "mano caída" es el signo clásico de lesión del nervio radial a nivel del surco radial del húmero. Esto se debe a la parálisis de todos los músculos extensores de la muñeca y los dedos. El tríceps no suele afectarse a menos que la lesión sea más proximal en la axila. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'N. Radial' }, dificultad: 'Difícil' },
    { id: 'ms_in_ncub_1', textoPregunta: '¿Qué nervio pasa por detrás del epicóndilo medial del húmero, donde es vulnerable a lesiones?', opciones: ['Nervio Mediano', 'Nervio Radial', 'Nervio Cubital', 'Nervio Axilar'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio cubital discurre por el surco del nervio cubital, posterior al epicóndilo medial. Un golpe en esta zona (el "hueso de la risa") estimula directamente este nervio. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Inervación', subtema: 'N. Cubital' }, dificultad: 'Fácil' },
    { id: 'ms_rt_ch_1', textoPregunta: 'El contenido del cuadrilátero humerotricipital (espacio axilar lateral) es el nervio axilar y la arteria...', opciones: ['Braquial profunda', 'Subescapular', 'Circunfleja humeral posterior', 'Torácica lateral'], indiceRespuestaCorrecta: 2, explicacion: 'Este espacio está limitado por los músculos redondo menor, redondo mayor, húmero y tríceps, y da paso al nervio axilar y a la arteria y vena circunflejas humerales posteriores. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Regiones topográficas', subtema: 'Cuadrilátero Humerotricipital' }, dificultad: 'Difícil' },
    { id: 'ms_rt_ax_1', textoPregunta: '¿Cuál de estas estructuras forma la pared anterior de la axila?', opciones: ['Músculo Serrato anterior', 'Músculo Dorsal ancho', 'Músculos Pectorales (mayor y menor)', 'Costillas y espacios intercostales'], indiceRespuestaCorrecta: 2, explicacion: 'Los músculos pectoral mayor y menor, junto con la fascia clavipectoral, constituyen la pared anterior de la fosa axilar. La pared posterior está formada por el subescapular, redondo mayor y dorsal ancho. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Regiones topográficas', subtema: 'Axila' }, dificultad: 'Media' },
    { id: 'ms_rt_tc_1', textoPregunta: '¿Cuál de las siguientes estructuras NO pasa por el túnel del carpo?', opciones: ['Nervio mediano', 'Tendón del flexor largo del pulgar', 'Nervio cubital', 'Tendones de los flexores superficial y profundo de los dedos'], indiceRespuestaCorrecta: 2, explicacion: 'El túnel carpiano contiene el nervio mediano y los nueve tendones de los flexores de los dedos. El nervio y la arteria cubitales no pasan por este túnel, sino por el canal de Guyon, más medial y superficial. Una fractura del ganchoso puede comprimir estas estructuras en el canal de Guyon. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Regiones topográficas', subtema: 'Túnel del Carpo' }, dificultad: 'Media' },
    { id: 'ms_rt_cg_1', textoPregunta: 'El canal de Guyon, ubicado en la muñeca, contiene el nervio y la arteria:', opciones: ['Radiales', 'Medianos', 'Cubitales', 'Axilares'], indiceRespuestaCorrecta: 2, explicacion: 'El canal de Guyon es un pasaje en la cara anteromedial de la muñeca que da paso al nervio y la arteria cubitales hacia la mano, superficiales al retináculo flexor. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Regiones topográficas', subtema: 'Canal de Guyon' }, dificultad: 'Media' },
    { id: 'ms_rt_ta_1', textoPregunta: '¿Qué arteria importante se puede palpar en el suelo de la tabaquera anatómica?', opciones: ['Arteria cubital', 'Arteria braquial', 'Arteria radial', 'Arteria interósea'], indiceRespuestaCorrecta: 2, explicacion: 'La arteria radial cruza el suelo de la tabaquera anatómica, formado por los huesos escafoides y trapecio, antes de formar el arco palmar profundo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Regiones topográficas', subtema: 'Tabaquera Anatómica' }, dificultad: 'Media' },
    { id: 'mi_c_h_1', textoPregunta: 'El acetábulo, que se articula con la cabeza del fémur, está formado por la fusión de tres huesos: el ilion, el isquion y el...', opciones: ['Sacro', 'Pubis', 'Coxis', 'Fémur'], indiceRespuestaCorrecta: 1, explicacion: 'El acetábulo es la cavidad cotiloidea del hueso coxal formada por la confluencia de las tres partes del hueso: ilion, isquion y pubis. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Cadera', subtema: 'Huesos de la Cadera' }, dificultad: 'Fácil' },
    { id: 'mi_c_h_2', textoPregunta: 'La espina ilíaca anterosuperior (EIAS) es un punto de referencia óseo importante y sirve de origen para el músculo:', opciones: ['Recto femoral', 'Sartorio', 'Glúteo medio', 'Aductor largo'], indiceRespuestaCorrecta: 1, explicacion: 'La EIAS es el origen del músculo sartorio y del ligamento inguinal. El recto femoral se origina en la espina ilíaca anteroinferior (EIAI). [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Cadera', subtema: 'Huesos de la Cadera' }, dificultad: 'Media' },
    { id: 'mi_c_ac_1', textoPregunta: '¿Cuál es el ligamento más fuerte del cuerpo humano, que refuerza la cápsula de la articulación de la cadera anteriormente?', opciones: ['Ligamento pubofemoral', 'Ligamento isquiofemoral', 'Ligamento iliofemoral (de Bigelow)', 'Ligamento redondo'], indiceRespuestaCorrecta: 2, explicacion: 'El ligamento iliofemoral, o ligamento en Y de Bigelow, es extremadamente fuerte y previene la hiperextensión de la cadera durante la bipedestación. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Cadera', subtema: 'Articulación de la Cadera' }, dificultad: 'Difícil' },
    { id: 'mi_c_rg_1', textoPregunta: '¿Qué músculo es el principal extensor de la cadera (esencial para levantarse de una silla o subir escaleras)?', opciones: ['Glúteo medio', 'Glúteo menor', 'Glúteo mayor', 'Piriforme'], indiceRespuestaCorrecta: 2, explicacion: 'El glúteo mayor es el músculo más grande y potente de la región glútea, y su función principal es la extensión de la cadera. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Cadera', subtema: 'Músculos de la Región Glútea' }, dificultad: 'Media' },
    { id: 'mi_c_rg_2', textoPregunta: 'La debilidad de los músculos glúteo medio y menor, que son abductores de la cadera, provoca un signo clínico llamado:', opciones: ['Signo de Trendelenburg', 'Signo de Lachman', 'Signo de Thompson', 'Signo de Babinski'], indiceRespuestaCorrecta: 0, explicacion: 'El signo de Trendelenburg positivo (caída de la pelvis contralateral al estar de pie sobre una pierna) indica debilidad de los abductores de la cadera, inervados por el nervio glúteo superior. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Cadera', subtema: 'Músculos de la Región Glútea' }, dificultad: 'Difícil' },
    { id: 'mi_m_f_1', textoPregunta: 'El trocánter mayor del fémur sirve como punto de inserción para qué grupo muscular importante?', opciones: ['Aductores', 'Cuádriceps', 'Isquiotibiales', 'Músculos glúteos (medio y menor)'], indiceRespuestaCorrecta: 3, explicacion: 'El trocánter mayor es una gran prominencia en el extremo proximal del fémur donde se insertan los potentes músculos abductores y rotadores de la cadera, como el glúteo medio y menor. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Fémur' }, dificultad: 'Media' },
    { id: 'mi_m_ca_1', textoPregunta: 'El grupo muscular del cuádriceps femoral está compuesto por quatro músculos: recto femoral, vasto lateral, vasto medial y...', opciones: ['Vasto superior', 'Vasto intermedio', 'Sartorio', 'Pectíneo'], indiceRespuestaCorrecta: 1, explicacion: 'El vasto intermedio se encuentra profundo al recto femoral y es el cuarto componente del cuádriceps, todos inervados por el nervio femoral. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Músculos del Compartimento Anterior y Medial' }, dificultad: 'Fácil' },
    { id: 'mi_m_ca_2', textoPregunta: '¿Qué nervio inerva el compartimento anterior del muslo, incluyendo al cuádriceps?', opciones: ['Nervio obturador', 'Nervio ciático', 'Nervio femoral', 'Nervio glúteo superior'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio femoral es el responsable de la inervación de los músculos del compartimento anterior del muslo, como el cuádriceps y el sartorio. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Músculos del Compartimento Anterior y Medial' }, dificultad: 'Media' },
    { id: 'mi_m_ca_3', textoPregunta: 'La mayoría de los músculos del compartimento medial del muslo (aductores) son inervados por el nervio:', opciones: ['Femoral', 'Obturador', 'Ciático', 'Glúteo inferior'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio obturador pasa a través del foramen obturador para inervar los músculos aductores del muslo. Una excepción es la porción isquiotibial del aductor mayor, inervada por el nervio ciático (división tibial). [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Músculos del Compartimento Anterior y Medial' }, dificultad: 'Media' },
    { id: 'mi_m_cp_1', textoPregunta: 'Los músculos isquiotibiales (bíceps femoral, semitendinoso y semimembranoso) tienen un origen común en:', opciones: ['El trocánter mayor', 'La línea áspera del fémur', 'La tuberosidad isquiática', 'La cresta ilíaca'], indiceRespuestaCorrecta: 2, explicacion: 'Los tres músculos que componen el grupo de los isquiotibiales (excepto la cabeza corta del bíceps femoral) se originan en la tuberosidad isquiática del hueso coxal. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Músculos del Compartimento Posterior' }, dificultad: 'Media' },
    { id: 'mi_m_cp_2', textoPregunta: 'La principal acción de los músculos isquiotibiales es la flexión de la rodilla y la ______ de la cadera.', opciones: ['Flexión', 'Extensión', 'Abducción', 'Rotación medial'], indiceRespuestaCorrecta: 1, explicacion: 'Al ser músculos biarticulares, los isquiotibiales cruzan tanto la rodilla (flexión) como la cadera (extensión). [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Muslo', subtema: 'Músculos del Compartimento Posterior' }, dificultad: 'Fácil' },
    { id: 'mi_p_r_1', textoPregunta: '¿Qué ligamento de la rodilla previene el desplazamiento anterior de la tibia sobre el fémur?', opciones: ['Ligamento Cruzado Posterior (LCP)', 'Ligamento Colateral Medial (LCM)', 'Ligamento Cruzado Anterior (LCA)', 'Ligamento Rotuliano'], indiceRespuestaCorrecta: 2, explicacion: 'El LCA es crucial para la estabilidad de la rodilla, oponiéndose a la traslación anterior de la tibia y a la hiperextensión. Es uno de los ligamentos más frecuentemente lesionados en deportes. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Articulación de la Rodilla' }, dificultad: 'Media' },
    { id: 'mi_p_tp_1', textoPregunta: 'El hueso de la pierna que soporta el peso del cuerpo es:', opciones: ['Peroné (Fíbula)', 'Tibia', 'Fémur', 'Astrágalo'], indiceRespuestaCorrecta: 1, explicacion: 'La tibia es el hueso grande y medial de la pierna que transmite el peso corporal desde el fémur hasta el pie. El peroné no soporta peso, pero es importante para la estabilidad del tobillo. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Tibia y Peroné' }, dificultad: 'Fácil' },
    { id: 'mi_p_ca_1', textoPregunta: 'El músculo tibial anterior, principal dorsiflexor del pie, es inervado por el nervio:', opciones: ['Tibial', 'Peroneo superficial', 'Peroneo profundo', 'Sural'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio peroneo profundo inerva a todos los músculos del compartimento anterior de la pierna, incluyendo el tibial anterior. Una lesión de este nervio puede causar "pie caído". [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Músculos del Compartimento Anterior y Lateral de la Pierna' }, dificultad: 'Media' },
    { id: 'mi_p_cp_1', textoPregunta: 'El tríceps sural está formado por dos músculos: el gastrocnemio y el...', opciones: ['Tibial posterior', 'Flexor largo de los dedos', 'Sóleo', 'Plantar'], indiceRespuestaCorrecta: 2, explicacion: 'El sóleo se encuentra profundo al gastrocnemio y junto a él forma el tríceps sural, que se inserta en el calcáneo a través del tendón de Aquiles (calcáneo). [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Músculos del Compartimento Posterior de la Pierna' }, dificultad: 'Media' },
    { id: 'mi_p_hp_1', textoPregunta: 'El hueso del talón, el más grande del tarso, se llama:', opciones: ['Astrágalo', 'Navicular', 'Calcáneo', 'Cuboides'], indiceRespuestaCorrecta: 2, explicacion: 'El calcáneo es el hueso que forma el talón y sobre el que se inserta el tendón de Aquiles. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Huesos del Pie' }, dificultad: 'Fácil' },
    { id: 'mi_p_at_1', textoPregunta: '¿Qué hueso del tarso se articula con la tibia y el peroné para formar la articulación del tobillo?', opciones: ['Calcáneo', 'Astrágalo (Talus)', 'Navicular', 'Cuboides'], indiceRespuestaCorrecta: 1, explicacion: 'El astrágalo encaja en la mortaja formada por la tibia y el peroné, permitiendo la flexión dorsal y plantar del pie. No tiene inserciones musculares. [CITA:gray]', tags: { regionId: 'miembro-inferior', tema: 'Rodilla, Pierna y Pie', subtema: 'Articulación del Tobillo' }, dificultad: 'Media' },
    { id: 'cc_c_c_1', textoPregunta: '¿Qué hueso del cráneo alberga el órgano de la audición y el equilibrio?', opciones: ['Frontal', 'Occipital', 'Esfenoides', 'Temporal'], indiceRespuestaCorrecta: 3, explicacion: 'La porción petrosa del hueso temporal contiene el oído interno, responsable de la audición y el equilibrio. [CITA:gray]', tags: { regionId: 'cabeza-cuello', tema: 'Cráneo', subtema: 'Huesos del Cráneo' }, dificultad: 'Media' },
    { id: 'cc_c_c_2', textoPregunta: 'El foramen magno, por donde pasa la médula espinal, se encuentra en el hueso:', opciones: ['Parietal', 'Occipital', 'Frontal', 'Etmoides'], indiceRespuestaCorrecta: 1, explicacion: 'El foramen magno es una gran abertura en la base del hueso occipital que conecta la cavidad craneal con el canal vertebral. [CITA:gray]', tags: { regionId: 'cabeza-cuello', tema: 'Cráneo', subtema: 'Huesos del Cráneo' }, dificultad: 'Fácil' },
    { id: 'cc_m_me_1', textoPregunta: '¿Cuál es el principal músculo de la masticación que eleva la mandíbula?', opciones: ['Buccinador', 'Temporal', 'Masetero', 'Pterigoideo lateral'], indiceRespuestaCorrecta: 2, explicacion: 'El masetero es un músculo potente y superficial que se origina en el arco cigomático y se inserta en la mandíbula, siendo un elevador primario. Todos los músculos de la masticación están inervados por el nervio trigémino (V3). [CITA:gray]', tags: { regionId: 'cabeza-cuello', tema: 'Músculos', subtema: 'Músculos de la Expresión Facial y Masticación' }, dificultad: 'Media' },
    { id: 'cc_c_tc_1', textoPregunta: 'El triángulo carotídeo del cuello contiene la arteria carótida común, la vena yugular interna y el nervio...', opciones: ['Facial (VII)', 'Vago (X)', 'Hipogloso (XII)', 'Frénico'], indiceRespuestaCorrecta: 1, explicacion: 'Estas tres estructuras (arteria carótida común, vena yugular interna y nervio vago) forman el paquete vasculonervioso principal del cuello y se encuentran dentro de la vaina carotídea. [CITA:gray]', tags: { regionId: 'cabeza-cuello', tema: 'Cuello', subtema: 'Triángulos del Cuello' }, dificultad: 'Difícil' },
    { id: 'to_pt_co_1', textoPregunta: '¿Cómo se clasifican las costillas que se unen directamente al esternón a través de su propio cartílago costal (pares 1-7)?', opciones: ['Verdaderas', 'Falsas', 'Flotantes', 'Atípicas'], indiceRespuestaCorrecta: 0, explicacion: 'Las costillas verdaderas (vertebroesternales) tienen una conexión cartilaginosa directa con el esternón. Las falsas (8-10) se unen indirectamente y las flotantes (11-12) no se unen. [CITA:gray]', tags: { regionId: 'torax', tema: 'Pared Torácica', subtema: 'Costillas y Esternón' }, dificultad: 'Fácil' },
    { id: 'to_co_c_1', textoPregunta: 'La válvula cardíaca que se encuentra entre la aurícula izquierda y el ventrículo izquierdo es la:', opciones: ['Válvula tricúspide', 'Válvula aórtica', 'Válvula pulmonar', 'Válvula mitral (bicúspide)'], indiceRespuestaCorrecta: 3, explicacion: 'La válvula mitral controla el flujo de sangre oxigenada desde la aurícula izquierda al ventrículo izquierdo. Tiene dos valvas, por eso se llama bicúspide. [CITA:gray]', tags: { regionId: 'torax', tema: 'Corazón', subtema: 'Cavidades y Válvulas' }, dificultad: 'Media' },
    { id: 'to_co_c_2', textoPregunta: '¿Qué arterias se originan de la aorta ascendente para irrigar el propio músculo cardíaco?', opciones: ['Arterias subclavias', 'Arterias coronarias', 'Arterias intercostales', 'Arterias pulmonares'], indiceRespuestaCorrecta: 1, explicacion: 'Las arterias coronarias derecha e izquierda nacen de los senos aórticos justo por encima de la válvula aórtica para irrigar el miocardio. [CITA:gray]', tags: { regionId: 'torax', tema: 'Corazón', subtema: 'Irrigación del Corazón' }, dificultad: 'Media' },
    { id: 'to_p_lp_1', textoPregunta: 'El pulmón derecho se diferencia del izquierdo por tener:', opciones: ['Dos lóbulos', 'Una língula', 'Tres lóbulos', 'Una incisura cardíaca más grande'], indiceRespuestaCorrecta: 2, explicacion: 'El pulmón derecho está dividido por las fisuras oblicua y horizontal en tres lóbulos (superior, medio e inferior), mientras que el izquierdo solo tiene dos (superior e inferior) para acomodar el corazón. [CITA:gray]', tags: { regionId: 'torax', tema: 'Pulmones', subtema: 'Lóbulos y Pleura' }, dificultad: 'Fácil' },
    { id: 'ab_po_rm_1', textoPregunta: 'La vaina de los rectos, que envuelve al músculo recto del abdomen, está formada por las aponeurosis de qué músculos?', opciones: ['Psoas mayor e ilíaco', 'Oblicuo externo, oblicuo interno y transverso del abdomen', 'Cuadrado lumbar y diafragma', 'Solo el oblicuo externo'], indiceRespuestaCorrecta: 1, explicacion: 'Las aponeurosis de los tres músculos planos del abdomen (oblicuo externo, interno y transverso) se entrelazan para formar la vaina de los rectos, que contiene al músculo recto del abdomen. [CITA:gray]', tags: { regionId: 'abdomen', tema: 'Pared y Órganos', subtema: 'Músculos de la Pared Abdominal' }, dificultad: 'Media' },
    { id: 'ab_po_es_1', textoPregunta: '¿En qué porción del tubo digestivo ocurre la mayor parte de la absorción de nutrientes?', opciones: ['Estómago', 'Intestino delgado', 'Intestino grueso', 'Esófago'], indiceRespuestaCorrecta: 1, explicacion: 'Gracias a su gran longitud y a la presencia de vellosidades y microvellosidades, el intestino delgado (duodeno, yeyuno, íleon) es el sitio principal de absorción de la mayoría de los nutrientes. [CITA:gray]', tags: { regionId: 'abdomen', tema: 'Pared y Órganos', subtema: 'Estómago e Intestinos' }, dificultad: 'Fácil' },
    { id: 'pp_ep_e_1', textoPregunta: 'El suelo pélvico está formado principalmente por el músculo:', opciones: ['Obturador interno', 'Piriforme', 'Elevador del ano', 'Isquiocavernoso'], indiceRespuestaCorrecta: 2, explicacion: 'El músculo elevador del ano, junto con el coccígeo, forma el diafragma pélvico, que es el componente principal del suelo pélvico y da soporte a los órganos pélvicos. [CITA:gray]', tags: { regionId: 'pelvis-perine', tema: 'Estructuras Pélvicas', subtema: 'Estructuras Óseas y Musculares' }, dificultad: 'Media' },
    { id: 'na_c_lc_1', textoPregunta: '¿Qué lóbulo del cerebro es el principal responsable de la visión?', opciones: ['Frontal', 'Parietal', 'Temporal', 'Occipital'], indiceRespuestaCorrecta: 3, explicacion: 'La corteza visual primaria y las áreas de asociación visual se encuentran en el lóbulo occipital, en la parte posterior del cerebro. [CITA:gray]', tags: { regionId: 'neuroanatomia', tema: 'Cerebro', subtema: 'Lóbulos Cerebrais' }, dificultad: 'Fácil' },
    { id: 'na_me_sc_1', textoPregunta: 'La sustancia gris de la médula espinal, que contiene los cuerpos neuronales, tiene forma de:', opciones: ['Círculo', 'Cuadrado', 'Letra H o mariposa', 'Triángulo'], indiceRespuestaCorrecta: 2, explicacion: 'En un corte transversal, la sustancia gris medular se organiza en astas anteriores (motoras) y posteriores (sensitivas), adoptando una forma característica de H. [CITA:gray]', tags: { regionId: 'neuroanatomia', tema: 'Médula Espinal', subtema: 'Sustancia Gris y Blanca' }, dificultad: 'Fácil' },
];


// ==========================================================================================
// DATOS DE BIBLIOGRAFÍA
// ==========================================================================================

export const bibliographyData: BibliographyEntry[] = [
    {
        key: 'gray',
        author: 'Standring, S.',
        year: 2020,
        title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
        publisher: 'Elsevier'
    },
];


// ==========================================================================================
// GENERACIÓN DE DATOS DE NAVEGACIÓN
// Estructura jerárquica para la UI, generada a partir del `questionBank`.
// ==========================================================================================

const generateNavigationData = (questions: QuestionData[]): NavigationRegion[] => {
    const navigationMap: { [regionId: string]: NavigationRegion } = {};

    questions.forEach(q => {
        const { regionId, tema: temaName, subtema: subtemaName } = q.tags;
        
        // 1. Asegurar que la Región existe
        if (!navigationMap[regionId]) {
            const meta = regionMetaData[regionId];
            if (!meta) {
                console.warn(`No metadata found for regionId: ${regionId}`);
                return;
            }
            navigationMap[regionId] = {
                id: regionId,
                name: meta.name,
                description: meta.description,
                visuals: meta.visuals,
                temas: [],
            };
        }

        // 2. Asegurar que el Tema existe en la Región
        const temaId = `${regionId}-${temaName.replace(/\s+/g, '_')}`;
        let tema = navigationMap[regionId].temas.find(t => t.id === temaId);
        if (!tema) {
            tema = {
                id: temaId,
                name: temaName,
                subtemas: [],
            };
            navigationMap[regionId].temas.push(tema);
        }

        // 3. Asegurar que el Subtema existe en el Tema y actualizar contador
        const subtemaId = `${temaId}-${subtemaName.replace(/\s+/g, '_')}`;
        let subtema = tema.subtemas.find(st => st.id === subtemaId);
        if (!subtema) {
            subtema = {
                id: subtemaId,
                name: subtemaName,
                questionCount: 0,
            };
            tema.subtemas.push(subtema);
        }
        subtema.questionCount += 1;
    });
    
    // Convertir el mapa a un array y ordenar
    const sortedNavigationData = Object.values(navigationMap);

    // Opcional: ordenar temas y subtemas si es necesario
    sortedNavigationData.forEach(region => {
        region.temas.sort((a, b) => a.name.localeCompare(b.name));
        region.temas.forEach(tema => {
            tema.subtemas.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

    return sortedNavigationData;
};

export const navigationData = generateNavigationData(questionBank);

// ==========================================================================================
// CONFIGURACIÓN DEL JUEGO
// Constantes que definen la progresión, tienda, logros, etc.
// ==========================================================================================

export const MAX_LEVEL = 50;
export const PASS_THRESHOLD = 0.8; // 80% para pasar un quiz
export const HEART_REGEN_TIME = 10 * 60 * 1000; // 10 minutes

// Avatares base (estáticos)
const BASE_AVATARS: Avatar[] = [
    { id: 'novice', emoji: '💀', name: 'Novato', unlockCondition: { type: 'level', value: 1, description: 'Alcanza el Nivel 1' } },
    { id: 'brainiac', emoji: '🧠', name: 'Cerebrito', unlockCondition: { type: 'level', value: 5, description: 'Alcanza el Nivel 5' } },
    { id: 'explorer', emoji: '🧭', name: 'Explorador', unlockCondition: { type: 'level', value: 10, description: 'Alcanza el Nivel 10' } },
    { id: 'master', emoji: '🎓', name: 'Maestro', unlockCondition: { type: 'level', value: 20, description: 'Alcanza el Nivel 20' } },
    { id: 'legend', emoji: '🏆', name: 'Leyenda', unlockCondition: { type: 'level', value: 40, description: 'Alcanza el Nivel 40' } },
    { id: 'robot', emoji: '🤖', name: 'Robot', unlockCondition: { type: 'achievement', value: 'perfectionist:2', description: 'Alcanza Nivel 2 en Perfeccionista (5 tests perfectos)' } },
    { id: 'detective', emoji: '🕵️', name: 'Detective', unlockCondition: { type: 'achievement', value: 'explorer:1', description: 'Aprueba un test de cada región' } },
    { id: 'ghost', emoji: '👻', name: 'Fantasma', unlockCondition: { type: 'achievement', value: 'mystery_box', description: 'Encuéntralo en una Caja Misteriosa' } },
    { id: 'alien', emoji: '👽', name: 'Alien', unlockCondition: { type: 'achievement', value: 'mystery_box', description: 'Encuéntralo en una Caja Misteriosa' } },
    { id: 'ninja', emoji: '🥷', name: 'Ninja', unlockCondition: { type: 'exam_speed', value: 15, description: 'Completa un examen de 20+ preguntas en menos de 15s por pregunta' } },
    { id: 'wizard', emoji: '🧙', name: 'Mago', unlockCondition: { type: 'achievement', value: 'spender:2', description: 'Gasta 5,000 huesitos' } },
];

// --- Reemplazo de emoji por imagen si existe archivo con id coincidente ---
const imageById: Record<string, { url: string; name: string }> = imageAvatars.reduce((acc, img) => {
	acc[img.id] = { url: img.url, name: img.name };
	return acc;
}, {} as Record<string, { url: string; name: string }>);

const BASE_AVATARS_OVERRIDDEN: Avatar[] = BASE_AVATARS.map(a => {
	const match = imageById[a.id];
	if (match) {
		return { ...a, emoji: match.url };
	}
	return a;
});

// Asignación de niveles disponibles para avatares de imagen (priorizar camino de niveles)
const usedLevelValues = new Set<number>(
	BASE_AVATARS_OVERRIDDEN.filter(a => a.unlockCondition.type === 'level').map(a => a.unlockCondition.value as number)
);
const availableLevels: number[] = [];
for (let lvl = 2; lvl <= MAX_LEVEL; lvl++) {
	if (!usedLevelValues.has(lvl)) availableLevels.push(lvl);
}

// Solo crear avatares nuevos para imágenes cuyo id NO coincida con un avatar base existente
const additionalImageAvatars = imageAvatars.filter(img => !BASE_AVATARS_OVERRIDDEN.some(a => a.id === img.id));

// Seleccionar niveles espaciados uniformemente a lo largo de los disponibles
const pickSpacedLevels = (levels: number[], count: number): number[] => {
	if (count <= 0 || levels.length === 0) return [];
	if (count === 1) return [levels[Math.floor(levels.length / 2)]];
	const indices = Array.from({ length: count }, (_, i) => Math.floor(i * (levels.length - 1) / (count - 1)));
	// Asegurar unicidad
	const uniqueIdx: number[] = [];
	indices.forEach(idx => { if (!uniqueIdx.includes(idx)) uniqueIdx.push(idx); });
	return uniqueIdx.map(i => levels[i]);
};

const levelAssignableCount = Math.min(additionalImageAvatars.length, availableLevels.length);
const spacedLevels = pickSpacedLevels(availableLevels, levelAssignableCount);
const imageAvatarsForLevels = additionalImageAvatars.slice(0, levelAssignableCount);
const imageAvatarsForMystery = additionalImageAvatars.slice(levelAssignableCount);

const IMAGE_AVATARS_MAPPED: Avatar[] = [
	...imageAvatarsForLevels.map((img, i) => {
		const levelValue = spacedLevels[i];
		return {
			id: `img_${img.id}`,
			emoji: img.url,
			name: img.name,
			unlockCondition: { type: 'level', value: levelValue, description: `Alcanza el Nivel ${levelValue}` }
		};
	}),
	...imageAvatarsForMystery.map((img) => ({
		id: `img_${img.id}`,
		emoji: img.url,
		name: img.name,
		unlockCondition: { type: 'achievement', value: 'mystery_box', description: 'Encuéntralo en una Caja Misteriosa' }
	}))
];

const COMBINED_AVATARS: Avatar[] = [
	...BASE_AVATARS_OVERRIDDEN,
	...IMAGE_AVATARS_MAPPED
];

export const AVATAR_DATA: Avatar[] = COMBINED_AVATARS.slice().sort((a, b) => {
	const aIsLevel = a.unlockCondition.type === 'level';
	const bIsLevel = b.unlockCondition.type === 'level';
	if (aIsLevel && bIsLevel) {
		return (a.unlockCondition.value as number) - (b.unlockCondition.value as number);
	}
	if (aIsLevel) return -1;
	if (bIsLevel) return 1;
	return 0; // mantiene el orden relativo de los no-level
});

export const LEVEL_REWARDS: LevelReward[] = Array.from({ length: MAX_LEVEL }, (_, i) => {
	const level = i + 1;
	const reward: LevelReward = {
		level,
		xp: Math.floor(100 * Math.pow(level - 1, 1.8)),
		bones: 50 + (level * 5),
		avatarId: AVATAR_DATA.find(a => a.unlockCondition.type === 'level' && a.unlockCondition.value === level)?.id || null,
	};
	// Cada 6 niveles, entrega un pack de botiquín variado
	if (level > 1 && level % 6 === 0) {
		reward.lifelines = {
			fiftyFifty: 1,
			quickReview: 1,
			secondChance: 1,
			adrenaline: 0,
			skip: 0,
			double: 0,
			immunity: 0,
		};
	}
	// Cada 10 niveles, extra de Revivir
	if (level > 1 && level % 10 === 0) {
		reward.lifelines = { ...(reward.lifelines || {}), secondChance: ((reward.lifelines?.secondChance) || 0) + 1 };
	}
	return reward;
});

export const shopItems: ShopItem[] = [
    { id: 'buy_one_heart', name: 'Comprar 1 Vida', description: 'Recupera una vida para seguir jugando.', price: 20, icon: 'buy_one_heart' },
    { id: 'streak_freeze', name: 'Protector de Racha', description: 'Protege tu racha de días si fallas uno.', price: 250, icon: 'streak_freeze' },
    { id: 'xp_boost', name: 'Boost de XP (15 min)', description: 'Duplica el XP que ganas durante 15 minutos.', price: 300, icon: 'xp_boost' },
    { id: 'double_or_nothing', name: 'Doble o Nada', description: 'Apuesta 50. ¡Haz un test perfecto para ganar 100!', price: 0, icon: 'double_or_nothing' },
    // Botiquín
    { id: 'lifeline_fifty_fifty', name: 'Descarte (50/50)', description: 'Elimina dos opciones incorrectas en una pregunta.', price: 200, icon: 'lifeline_fifty_fifty', imageUrl: '/images/Descarte.png' },
    { id: 'lifeline_quick_review', name: 'La Pista', description: 'Muestra una pista o dato clave sobre la pregunta.', price: 150, icon: 'lifeline_quick_review', imageUrl: '/images/Pista.png' },
    { id: 'lifeline_adrenaline', name: 'Adrenalina', description: 'Añade tiempo extra al temporizador de la pregunta.', price: 180, icon: 'lifeline_adrenaline', imageUrl: '/images/Adrenalina.png' },
    { id: 'lifeline_skip', name: 'Salta', description: 'Salta la pregunta sin perder vida ni racha.', price: 220, icon: 'lifeline_skip', imageUrl: '/images/Saltar.png' },
    { id: 'lifeline_double', name: 'Duplica', description: 'Duplica los puntos si aciertas esta pregunta.', price: 260, icon: 'lifeline_double', imageUrl: '/images/Duplicar.png' },
    { id: 'lifeline_second_chance', name: 'Revivir', description: 'Permite un segundo intento si fallas.', price: 300, icon: 'lifeline_second_chance', imageUrl: '/images/Revivir.png' },
    { id: 'lifeline_immunity', name: 'Inmunidad', description: 'Protege tu racha si fallas una respuesta.', price: 240, icon: 'lifeline_immunity', imageUrl: '/images/Inmunidad.png' },
    { id: 'mystery_box', name: 'Caja Misteriosa', description: 'Contiene una recompensa aleatoria. ¡Puede ser cualquier cosa!', price: 500, icon: 'mystery_box' },
];

export const aiOpponentsData: AIOpponent[] = [
    {
        id: 'cartografo',
        name: 'El Cartógrafo',
        avatar: '🗺️',
        bio: 'Describe estructuras anatómicas con precisión. Adivina a qué se refiere.',
        specialty: 'Anatomía Descriptiva',
        unlockLevel: 1,
        systemInstruction: "Eres 'El Cartógrafo', un Maestro de Anatomía. Tu poder es la descripción pura. No muestras imágenes; describes estructuras óseas, musculares o viscerales para que el estudiante las identifique. Después de una respuesta, haces una pregunta de seguimiento sobre un accidente, inserción o función relacionada. Eres formal, preciso y didáctico. Tu objetivo es construir un mapa mental en el estudiante. En tu respuesta final (después de 4-5 interacciones), si el estudiante ha ganado, TODA tu respuesta DEBE ser un apunte de estudio para su compendio. Dale formato así: ### Título del Apunte\n\nContenido del apunte detallado. No añadas ningún otro texto conversacional.",
        initialPrompt: "Saludos, aprendiz. Soy el Cartógrafo. Mi dominio es la forma y la estructura. Empecemos. Describo una estructura ósea: Soy un hueso largo, par, situado en la cara medial del antebrazo. Me articulo proximalmente con la tróclea del húmero. ¿Qué hueso soy?"
    },
    {
        id: 'clinico',
        name: 'El Clínico',
        avatar: '🩺',
        bio: 'Presenta casos clínicos. Deduce la anatomía afectada a través de los síntomas.',
        specialty: 'Anatomía Clínica',
        unlockLevel: 5,
        systemInstruction: "Eres 'El Clínico', un Maestro de Anatomía. Tu poder es presentar casos clínicos que revelan la anatomía subyacente. Describes síntomas y hallazgos en un paciente imaginario. El estudiante debe deducir la estructura anatómica afectada (nervio, músculo, arteria). Tus preguntas de seguimiento profundizan en la relevancia clínica. Eres directo, inquisitivo y te centras en la aplicación práctica del conocimiento. El objetivo es que el estudiante piense como un médico. En tu respuesta final (después de 4-5 interacciones), si el estudiante ha ganado, TODA tu respuesta DEBE ser un apunte de estudio para su compendio. Dale formato así: ### Título del Apunte\n\nContenido del apunte detallado. No añadas ningún otro texto conversacional.",
        initialPrompt: "Bienvenido a la consulta. Soy el Clínico. Aquí, el conocimiento anatómico salva vidas. Tu primer caso: Llega a tu consulta un paciente de 45 años. Refiere hormigueo en los tres primeros dedos de la mano derecha y debilidad al agarrar objetos. Los síntomas empeoran por la noche. Basado en esta descripción, ¿qué nervio es el principal sospechoso de estar comprimido?"
    },
    {
        id: 'disector',
        name: 'El Disector',
        avatar: '🔬',
        bio: 'Te guía en una disección imaginaria, preguntando por capas y relaciones espaciales.',
        specialty: 'Anatomía Topográfica',
        unlockLevel: 15,
        systemInstruction: "Eres 'El Disector', un Maestro de Anatomía. Tu poder es la comprensión de las relaciones espaciales. Guías al estudiante a través de una disección imaginaria, capa por capa. Preguntas sobre qué estructura se encuentra superficial, profunda, medial o lateral a otra. Eres meticuloso, descriptivo y exiges un conocimiento tridimensional preciso. Tu objetivo es que el estudiante visualice el cuerpo en su mente como si lo estuviera disecando. En tu respuesta final (después de 4-5 interacciones), si el estudiante ha ganado, TODA tu respuesta DEBE ser un apunte de estudio para su compendio. Dale formato así: ### Título del Apunte\n\nContenido del apunte detallado. No añadas ningún otro texto conversacional.",
        initialPrompt: "Ponte los guantes. Soy el Disector. La anatomía se aprende en la mesa, no solo en los libros. Empezamos en el cuello. Acabas de retirar el músculo esternocleidomastoideo, revelando el paquete vasculonervioso del cuello. Nombra sus tres componentes principales, de lateral a medial."
    }
];

export const achievementsData: Achievement[] = [
    {
        id: 'quiz_completer',
        name: 'Maestro de Quizzes',
        description: 'Demuestra tu dedicación completando cuestionarios.',
        icon: 'graduation_hat',
        action: { type: 'view', value: 'home' },
        tiers: [
            { level: 1, description: 'Completa tu primer cuestionario.', target: 1, reward: { bones: 25, xp: 50 } },
            { level: 2, description: 'Completa 5 cuestionarios.', target: 5, reward: { bones: 50, xp: 100 } },
            { level: 3, description: 'Completa 15 cuestionarios.', target: 15, reward: { bones: 100, xp: 200 } },
            { level: 4, description: 'Completa 30 cuestionarios.', target: 30, reward: { bones: 200, xp: 400 } },
            { level: 5, description: 'Completa 60 cuestionarios.', target: 60, reward: { bones: 400, xp: 800 } },
            { level: 6, description: 'Completa 120 cuestionarios.', target: 120, reward: { bones: 800, xp: 1600 } },
            { level: 7, description: 'Completa 250 cuestionarios.', target: 250, reward: { bones: 1500, xp: 3000 } },
            { level: 8, description: 'Completa 500 cuestionarios.', target: 500, reward: { bones: 2500, xp: 5000 } },
            { level: 9, description: 'Completa 1000 cuestionarios.', target: 1000, reward: { bones: 5000, xp: 10000 } },
            { level: 10, description: 'Completa 2000 cuestionarios.', target: 2000, reward: { bones: 10000, xp: 20000 } },
        ],
        progress: (user) => user.totalQuizzesCompleted,
    },
    {
        id: 'perfectionist',
        name: 'Perfeccionista',
        description: 'La práctica hace al maestro. Consigue puntuaciones perfectas.',
        icon: 'archery',
        action: { type: 'view', value: 'home' },
        tiers: [
            { level: 1, description: 'Consigue 1 test perfecto.', target: 1, reward: { bones: 50, xp: 100 } },
            { level: 2, description: 'Consigue 3 tests perfectos.', target: 3, reward: { bones: 100, xp: 250 } },
            { level: 3, description: 'Consigue 8 tests perfectos.', target: 8, reward: { bones: 200, xp: 500 } },
            { level: 4, description: 'Consigue 15 tests perfectos.', target: 15, reward: { bones: 400, xp: 1000 } },
            { level: 5, description: 'Consigue 25 tests perfectos.', target: 25, reward: { bones: 600, xp: 1500 } },
            { level: 6, description: 'Consigue 40 tests perfectos.', target: 40, reward: { bones: 1000, xp: 2500 } },
            { level: 7, description: 'Consigue 60 tests perfectos.', target: 60, reward: { bones: 2000, xp: 5000 } },
            { level: 8, description: 'Consigue 100 tests perfectos.', target: 100, reward: { bones: 4000, xp: 10000 } },
            { level: 9, description: 'Consigue 200 tests perfectos.', target: 200, reward: { bones: 8000, xp: 20000 } },
            { level: 10, description: 'Consigue 500 tests perfectos.', target: 500, reward: { bones: 15000, xp: 50000 } },
        ],
        progress: (user) => user.totalPerfectQuizzes,
    },
    {
        id: 'level_achiever',
        name: 'Ascendido',
        description: 'Sube de nivel para demostrar tu experiencia.',
        icon: '🗺️',
        tiers: [
            { level: 1, description: 'Alcanza el nivel 3.', target: 3, reward: { bones: 50 } },
            { level: 2, description: 'Alcanza el nivel 6.', target: 6, reward: { bones: 100 } },
            { level: 3, description: 'Alcanza el nivel 10.', target: 10, reward: { bones: 250 } },
            { level: 4, description: 'Alcanza el nivel 15.', target: 15, reward: { bones: 500 } },
            { level: 5, description: 'Alcanza el nivel 20.', target: 20, reward: { bones: 750 } },
            { level: 6, description: 'Alcanza el nivel 30.', target: 30, reward: { bones: 1000 } },
            { level: 7, description: 'Alcanza el nivel 40.', target: 40, reward: { bones: 2000 } },
            { level: 8, description: 'Alcanza el nivel 50.', target: 50, reward: { bones: 3000 } },
            { level: 9, description: 'Alcanza el nivel 75.', target: 75, reward: { bones: 5000 } },
            { level: 10, description: 'Alcanza el nivel 100.', target: 100, reward: { bones: 10000 } },
        ],
        progress: (user) => user.level,
    },
    {
        id: 'streaker',
        name: 'En Llamas',
        description: 'Mantén la racha de días consecutivos para ganar bonus.',
        icon: 'llama',
        tiers: [
            { level: 1, description: 'Mantén una racha de 2 días.', target: 2, reward: { bones: 50, xp: 100 } },
            { level: 2, description: 'Mantén una racha de 5 días.', target: 5, reward: { bones: 150, xp: 300 } },
            { level: 3, description: 'Mantén una racha de 10 días.', target: 10, reward: { bones: 500, xp: 1000 } },
            { level: 4, description: 'Mantén una racha de 20 días.', target: 20, reward: { bones: 1000, xp: 2000 } },
            { level: 5, description: 'Mantén una racha de 35 días.', target: 35, reward: { bones: 2500, xp: 5000 } },
            { level: 6, description: 'Mantén una racha de 60 días.', target: 60, reward: { bones: 5000, xp: 10000 } },
            { level: 7, description: 'Mantén una racha de 100 días.', target: 100, reward: { bones: 7500, xp: 15000 } },
            { level: 8, description: 'Mantén una racha de 180 días.', target: 180, reward: { bones: 10000, xp: 20000 } },
            { level: 9, description: 'Mantén una racha de 300 días.', target: 300, reward: { bones: 15000, xp: 30000 } },
            { level: 10, description: 'Mantén una racha de 500 días.', target: 500, reward: { bones: 25000, xp: 50000 } },
        ],
        progress: (user) => user.streak,
    },
    {
        id: 'explorer',
        name: 'Trotamundos Anatómico',
        description: 'Demuestra tu conocimiento en todas las áreas.',
        icon: '🌍',
        action: { type: 'view', value: 'atlas' },
        tiers: [
            {
                level: 1,
                description: 'Aprueba al menos un cuestionario de cada región.',
                target: navigationData.length,
                reward: { bones: 250, xp: 500 }
            },
        ],
        progress: (user) => {
            const passedSubtemas = Object.entries(user.progress)
                .filter(([, data]) => data.passed);
            const passedRegions = new Set(passedSubtemas.map(([subtemaId]) => subtemaId.split('-')[0]));
            return passedRegions.size;
        },
    },
    {
        id: 'spender',
        name: 'Comprador Compulsivo',
        description: 'Usa tus Huesitos en la tienda para obtener ventajas.',
        icon: 'money_bag',
        action: { type: 'view', value: 'shop' },
        tiers: [
            { level: 1, description: 'Gasta 1,000 Huesitos.', target: 1000, reward: { xp: 200 } },
            { level: 2, description: 'Gasta 5,000 Huesitos.', target: 5000, reward: { xp: 500 } },
            { level: 3, description: 'Gasta 10,000 Huesitos.', target: 10000, reward: { xp: 1000 } },
            { level: 4, description: 'Gasta 25,000 Huesitos.', target: 25000, reward: { xp: 2000 } },
            { level: 5, description: 'Gasta 50,000 Huesitos.', target: 50000, reward: { xp: 4000 } },
            { level: 6, description: 'Gasta 100,000 Huesitos.', target: 100000, reward: { xp: 8000 } },
        ],
        progress: (user) => user.totalBonesSpent,
    },
    {
        id: 'sage',
        name: 'Sabelotodo',
        description: 'Cada respuesta correcta te acerca a la maestría.',
        icon: '🧑‍🏫',
        tiers: [
            { level: 1, description: 'Responde 100 preguntas correctamente.', target: 100, reward: { bones: 25, xp: 50 } },
            { level: 2, description: 'Responde 500 preguntas correctamente.', target: 500, reward: { bones: 75, xp: 150 } },
            { level: 3, description: 'Responde 1000 preguntas correctamente.', target: 1000, reward: { bones: 150, xp: 300 } },
            { level: 4, description: 'Responde 2500 preguntas correctamente.', target: 2500, reward: { bones: 300, xp: 600 } },
            { level: 5, description: 'Responde 5000 preguntas correctamente.', target: 5000, reward: { bones: 500, xp: 1000 } },
            { level: 6, description: 'Responde 10000 preguntas correctamente.', target: 10000, reward: { bones: 1000, xp: 2000 } },
            { level: 7, description: 'Responde 25000 preguntas correctamente.', target: 25000, reward: { bones: 2000, xp: 4000 } },
            { level: 8, description: 'Responde 50000 preguntas correctamente.', target: 50000, reward: { bones: 4000, xp: 8000 } },
        ],
        progress: (user) => user.totalCorrectAnswers,
    },
    {
        id: 'collector',
        name: 'Coleccionista',
        description: 'Desbloquea diferentes avatares para personalizar tu perfil.',
        icon: '🖼️',
        action: { type: 'view', value: 'profile' },
        tiers: [
            { level: 1, description: 'Desbloquea 3 avatares.', target: 3, reward: { bones: 50, xp: 100 } },
            { level: 2, description: 'Desbloquea 5 avatares.', target: 5, reward: { bones: 100, xp: 200 } },
            { level: 3, description: 'Desbloquea todos los avatares.', target: AVATAR_DATA.length, reward: { bones: 250, xp: 500 } },
        ],
        progress: (user) => user.unlockedAvatars.length,
    },
    {
        id: 'challenger',
        name: 'Desafiante',
        description: 'Completa los desafíos diarios para obtener recompensas.',
        icon: '✔️',
        action: { type: 'view', value: 'challenges' },
        tiers: [
            { level: 1, description: 'Completa 5 desafíos diarios.', target: 5, reward: { bones: 50, xp: 100 } },
            { level: 2, description: 'Completa 10 desafíos diarios.', target: 10, reward: { bones: 100, xp: 200 } },
            { level: 3, description: 'Completa 25 desafíos diarios.', target: 25, reward: { bones: 250, xp: 500 } },
            { level: 4, description: 'Completa 50 desafíos diarios.', target: 50, reward: { bones: 500, xp: 1000 } },
            { level: 5, description: 'Completa 100 desafíos diarios.', target: 100, reward: { bones: 1000, xp: 2000 } },
        ],
        progress: (user) => user.claimedChallenges.length,
    },
    {
        id: 'specialist',
        name: 'Especialista',
        description: 'Conviértete en un experto dominando todos los temas de una región.',
        icon: '🔬',
        action: { type: 'view', value: 'home' },
        tiers: [
            { level: 1, description: 'Domina 1 región por completo.', target: 1, reward: { bones: 100, xp: 200 } },
            { level: 2, description: 'Domina 3 regiones por completo.', target: 3, reward: { bones: 250, xp: 500 } },
            { level: 3, description: 'Domina 5 regiones por completo.', target: 5, reward: { bones: 500, xp: 1000 } },
            { level: 4, description: 'Domina todas las regiones.', target: navigationData.length, reward: { bones: 1000, xp: 2000 } },
        ],
        progress: (user) => {
            let masteredRegions = 0;
            navigationData.forEach(region => {
                const subtemas = region.temas.flatMap(t => t.subtemas);
                if (subtemas.length === 0) return;
                const completedCount = subtemas.filter(st => user.progress[st.id]?.passed).length;
                if (completedCount > 0 && completedCount === subtemas.length) {
                    masteredRegions++;
                }
            });
            return masteredRegions;
        },
    },
    {
        id: 'gambler',
        name: 'Apostador',
        description: 'Arriésgalo todo con el Doble o Nada.',
        icon: '🎲',
        action: { type: 'view', value: 'shop' },
        tiers: [
            { level: 1, description: 'Activa Doble o Nada 3 veces.', target: 3, reward: { xp: 50 } },
            { level: 2, description: 'Activa Doble o Nada 10 veces.', target: 10, reward: { bones: 100, xp: 100 } },
            { level: 3, description: 'Activa Doble o Nada 25 veces.', target: 25, reward: { bones: 250, xp: 250 } },
            { level: 4, description: 'Activa Doble o Nada 50 veces.', target: 50, reward: { bones: 500, xp: 500 } },
            { level: 5, description: 'Activa Doble o Nada 100 veces.', target: 100, reward: { bones: 1000, xp: 1000 } },
        ],
        progress: (user) => user.purchases?.['double_or_nothing'] || 0,
    },
];


export const dailyChallengesData: DailyChallenge[] = [
  { id: 'complete_3', title: 'Completa 3 Tests', target: 3, reward: 50, condition: (stats) => stats.quizzesCompleted >= 3, icon: 'CheckSquare' },
  { id: 'earn_150_xp', title: 'Gana 150 XP', target: 150, reward: 75, condition: (stats) => stats.xpEarned >= 150, icon: 'Zap' },
  { id: 'perfect_1', title: 'Consigue 1 Test Perfecto', target: 1, reward: 100, condition: (stats) => stats.perfectQuizzes >= 1, icon: 'Target' },
];

export const INITIAL_USER_NOTE: Omit<UserNote, 'id' | 'timestamp'> = {
    title: '',
    textContent: '',
    drawingContent: '',
};