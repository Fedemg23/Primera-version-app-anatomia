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
    { id: 'ms_h_car_2', textoPregunta: '¿Cuántos huesos forman el carpo en total?', opciones: ['6', '7', '8', '9'], indiceRespuestaCorrecta: 2, explicacion: 'El carpo está formado por 8 huesos dispuestos en dos filas: proximal (escafoides, semilunar, piramidal, pisiforme) y distal (trapecio, trapezoide, grande, ganchoso). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_3', textoPregunta: '¿Qué hueso del carpo es el más grande?', opciones: ['Escafoides', 'Semilunar', 'Hueso grande (Capitato)', 'Ganchoso'], indiceRespuestaCorrecta: 2, explicacion: 'El hueso grande (capitato) es el más voluminoso de los huesos del carpo y se localiza en el centro de la fila distal. Su cabeza se articula con el escafoides y semilunar. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_4', textoPregunta: '¿Cuál de estos huesos NO pertenece a la fila proximal del carpo?', opciones: ['Escafoides', 'Pisiforme', 'Trapecio', 'Semilunar'], indiceRespuestaCorrecta: 2, explicacion: 'El trapecio pertenece a la fila distal del carpo. La fila proximal está formada por escafoides, semilunar, piramidal y pisiforme (de lateral a medial). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_5', textoPregunta: '¿Con qué hueso del carpo se articula principalmente el primer metacarpiano (pulgar)?', opciones: ['Escafoides', 'Trapecio', 'Trapezoide', 'Hueso grande'], indiceRespuestaCorrecta: 1, explicacion: 'El primer metacarpiano se articula con el trapecio formando la articulación carpometacarpiana del pulgar, que tiene forma de "silla de montar" y permite los movimientos de oposición. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    
    // Preguntas adicionales para alcanzar ~50 preguntas por subtema
    { id: 'ms_h_car_6', textoPregunta: '¿Cuál es la disposición normal de los huesos del carpo?', opciones: ['Una sola fila', 'Dos filas paralelas', 'Tres filas superpuestas', 'Distribución circular'], indiceRespuestaCorrecta: 1, explicacion: 'Los huesos del carpo se disponen en dos filas: proximal (escafoides, semilunar, piramidal, pisiforme) y distal (trapecio, trapezoide, grande, ganchoso). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_7', textoPregunta: '¿Qué hueso del carpo tiene forma de gancho en su apófisis?', opciones: ['Ganchoso', 'Trapecio', 'Escafoides', 'Piramidal'], indiceRespuestaCorrecta: 0, explicacion: 'El hueso ganchoso (hamato) presenta una apófisis en forma de gancho (hamulus) que es palpable y sirve como referencia anatómica importante. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_8', textoPregunta: '¿Con qué radio y cúbito se articula principalmente la fila proximal del carpo?', opciones: ['Solo con el radio', 'Solo con el cúbito', 'Con ambos igualmente', 'Principalmente con el radio'], indiceRespuestaCorrecta: 3, explicacion: 'La fila proximal del carpo se articula principalmente con el radio. El cúbito no tiene contacto directo con los huesos del carpo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_9', textoPregunta: '¿Cuál es la función principal del pisiforme?', opciones: ['Articulación principal', 'Hueso sesamoideo', 'Soporte estructural', 'Inserción muscular'], indiceRespuestaCorrecta: 1, explicacion: 'El pisiforme actúa como un hueso sesamoideo dentro del tendón del flexor cubital del carpo, no participando directamente en la articulación radiocarpiana. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_10', textoPregunta: '¿Cuál es el hueso del carpo más lateral en la fila proximal?', opciones: ['Pisiforme', 'Piramidal', 'Semilunar', 'Escafoides'], indiceRespuestaCorrecta: 3, explicacion: 'El escafoides es el hueso más lateral (radial) de la fila proximal del carpo, articulándose directamente con el radio. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_11', textoPregunta: '¿Cuál es el hueso más medial de la fila distal del carpo?', opciones: ['Trapecio', 'Trapezoide', 'Hueso grande', 'Ganchoso'], indiceRespuestaCorrecta: 3, explicacion: 'El ganchoso es el hueso más medial (cubital) de la fila distal del carpo, caracterizado por su apófisis ganchosa. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_12', textoPregunta: '¿Qué ligamento importante se encuentra en el túnel del carpo?', opciones: ['Ligamento radiocarpiano', 'Ligamento transverso del carpo', 'Ligamento intercarpiano', 'Ligamento carpometacarpiano'], indiceRespuestaCorrecta: 1, explicacion: 'El ligamento transverso del carpo forma el techo del túnel del carpo, siendo crucial en el síndrome del túnel carpiano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_13', textoPregunta: '¿Entre qué huesos se encuentra la articulación mediocarpiana?', opciones: ['Radio y escafoides', 'Escafoides y trapecio', 'Fila proximal y distal del carpo', 'Carpo y metacarpianos'], indiceRespuestaCorrecta: 2, explicacion: 'La articulación mediocarpiana se encuentra entre la fila proximal y distal de los huesos del carpo, permitiendo movimientos complementarios de flexo-extensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_14', textoPregunta: '¿Cuál es la característica distintiva del hueso trapecio?', opciones: ['Tiene forma de media luna', 'Presenta una cresta para el pulgar', 'Tiene una apófisis ganchosa', 'Es el más pequeño'], indiceRespuestaCorrecta: 1, explicacion: 'El trapecio presenta una cresta prominente que sirve como inserción para músculos del pulgar y forma la articulación "silla de montar" con el primer metacarpiano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_15', textoPregunta: '¿Qué hueso del carpo se articula con el tercer metacarpiano?', opciones: ['Trapecio', 'Trapezoide', 'Hueso grande', 'Ganchoso'], indiceRespuestaCorrecta: 2, explicacion: 'El hueso grande (capitato) se articula principalmente con el tercer metacarpiano, siendo la articulación carpometacarpiana más estable. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_16', textoPregunta: '¿Cuál es la irrigación principal del escafoides?', opciones: ['Arteria radial', 'Arteria cubital', 'Arteria interósea', 'Arteria digital'], indiceRespuestaCorrecta: 0, explicacion: 'El escafoides recibe irrigación principalmente de la arteria radial, pero de forma retrógrada, lo que explica la alta incidencia de necrosis avascular tras fracturas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_17', textoPregunta: '¿Qué estructura pasa por el túnel del carpo?', opciones: ['Nervio radial', 'Nervio mediano', 'Nervio cubital', 'Nervio interóseo'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio mediano y los tendones flexores pasan por el túnel del carpo. La compresión del nervio mediano causa el síndrome del túnel carpiano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_18', textoPregunta: '¿Cuál es la forma característica del semilunar?', opciones: ['Triangular', 'Cúbica', 'Media luna', 'Ganchosa'], indiceRespuestaCorrecta: 2, explicacion: 'El semilunar tiene forma de media luna, de ahí su nombre, y es el hueso central de la fila proximal del carpo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_19', textoPregunta: '¿Qué hueso del carpo es más propenso a luxación?', opciones: ['Escafoides', 'Semilunar', 'Piramidal', 'Pisiforme'], indiceRespuestaCorrecta: 1, explicacion: 'El semilunar es el hueso del carpo más propenso a luxación, especialmente en traumatismos de muñeca con hiperextensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_20', textoPregunta: '¿Con cuántos huesos se articula el hueso grande?', opciones: ['Tres', 'Cuatro', 'Cinco', 'Seis'], indiceRespuestaCorrecta: 3, explicacion: 'El hueso grande se articula con seis huesos: escafoides, semilunar, trapecio, trapezoide, segundo y tercer metacarpianos. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_21', textoPregunta: '¿Cuál es la complicación más temida de una fractura de escafoides?', opciones: ['Infección', 'Necrosis avascular', 'Artritis', 'Rigidez'], indiceRespuestaCorrecta: 1, explicacion: 'La necrosis avascular es la complicación más temida debido a la irrigación retrógrada del escafoides, especialmente en el polo proximal. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_22', textoPregunta: '¿Qué test clínico es positivo en fracturas de escafoides?', opciones: ['Test de Finkelstein', 'Test de Watson', 'Test de la tabaquera anatómica', 'Test de Tinel'], indiceRespuestaCorrecta: 2, explicacion: 'El dolor a la palpación en la tabaquera anatómica es un signo clásico de fractura de escafoides. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_23', textoPregunta: '¿Cuál es la orientación normal del carpo?', opciones: ['Completamente plano', 'Ligeramente cóncavo', 'Convexo hacia palma', 'En forma de S'], indiceRespuestaCorrecta: 1, explicacion: 'El carpo forma una concavidad natural hacia la palma, creando el túnel del carpo que es completado por el ligamento transverso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_24', textoPregunta: '¿Qué metacarpianos se articulan con el ganchoso?', opciones: ['Primero y segundo', 'Segundo y tercero', 'Tercero y cuarto', 'Cuarto y quinto'], indiceRespuestaCorrecta: 3, explicacion: 'El ganchoso se articula con el cuarto y quinto metacarpianos, proporcionando movilidad al borde cubital de la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_25', textoPregunta: '¿Cuál es la función del arco transverso del carpo?', opciones: ['Aumentar movilidad', 'Formar túnel para tendones', 'Proporcionar fuerza', 'Todas las anteriores'], indiceRespuestaCorrecta: 3, explicacion: 'El arco transverso del carpo aumenta la movilidad, forma un túnel protector para tendones y nervios, y proporciona fuerza estructural a la muñeca. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_met_1', textoPregunta: '¿Cuántos huesos metacarpianos hay en cada mano?', opciones: ['4', '5', '7', '8'], indiceRespuestaCorrecta: 1, explicacion: 'Hay 5 huesos metacarpianos en cada mano, numerados del 1 (pulgar) al 5 (meñique). Forman el esqueleto de la palma de la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_2', textoPregunta: '¿Cuál es la característica distintiva del primer metacarpiano?', opciones: ['Es el más largo', 'Es el más grueso y corto', 'Tiene tres facetas articulares', 'Se articula con dos huesos del carpo'], indiceRespuestaCorrecta: 1, explicacion: 'El primer metacarpiano (pulgar) es el más grueso y corto de todos, adaptado para la función de oposición y prensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_3', textoPregunta: '¿Cuál es el metacarpiano más largo?', opciones: ['Primero', 'Segundo', 'Tercero', 'Cuarto'], indiceRespuestaCorrecta: 1, explicacion: 'El segundo metacarpiano es típicamente el más largo, seguido del tercero. Esta longitud contribuye a la función de agarre fuerte. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_4', textoPregunta: '¿Qué partes anatómicas tienen los metacarpianos?', opciones: ['Solo cabeza y cuerpo', 'Cabeza, cuerpo y base', 'Base y diáfisis únicamente', 'Epífisis y metáfisis'], indiceRespuestaCorrecta: 1, explicacion: 'Los metacarpianos tienen tres partes principales: base (proximal), cuerpo o diáfisis (medio) y cabeza (distal). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_5', textoPregunta: '¿Con qué estructura se articulan las cabezas de los metacarpianos?', opciones: ['Huesos del carpo', 'Falanges proximales', 'Entre sí', 'Huesos sesamoideos'], indiceRespuestaCorrecta: 1, explicacion: 'Las cabezas de los metacarpianos se articulan con las falanges proximales formando las articulaciones metacarpofalángicas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_6', textoPregunta: '¿Cuál es la función de los arcos de la mano formados por los metacarpianos?', opciones: ['Solo estética', 'Aumentar fuerza de agarre', 'Facilitar flexibilidad', 'Ambas B y C'], indiceRespuestaCorrecta: 3, explicacion: 'Los arcos longitudinal y transversal formados por los metacarpianos aumentan tanto la fuerza de agarre como la flexibilidad para adaptarse a objetos de diferentes formas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_7', textoPregunta: '¿Qué metacarpiano es más móvil?', opciones: ['Primero', 'Segundo', 'Cuarto', 'Quinto'], indiceRespuestaCorrecta: 3, explicacion: 'El quinto metacarpiano es el más móvil, permitiendo que el meñique se oponga al pulgar y contribuya significativamente al agarre. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_8', textoPregunta: '¿Cuál es la fractura más común de los metacarpianos?', opciones: ['Fractura de Bennett', 'Fractura de boxer', 'Fractura espiral', 'Fractura de base'], indiceRespuestaCorrecta: 1, explicacion: 'La fractura de boxer (fractura del cuello del quinto metacarpiano) es la más común, típicamente causada por golpear con el puño cerrado. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_9', textoPregunta: '¿Qué es una fractura de Bennett?', opciones: ['Fractura del quinto metacarpiano', 'Fractura-luxación de la base del primer metacarpiano', 'Fractura espiral del segundo metacarpiano', 'Fractura de la cabeza metacarpiana'], indiceRespuestaCorrecta: 1, explicacion: 'La fractura de Bennett es una fractura-luxación de la base del primer metacarpiano que afecta la articulación carpometacarpiana del pulgar. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_10', textoPregunta: '¿Cuál es la importancia clínica del segundo y tercer metacarpiano?', opciones: ['Son los más frágiles', 'Forman el eje fijo de la mano', 'Son los más móviles', 'No tienen importancia especial'], indiceRespuestaCorrecta: 1, explicacion: 'El segundo y tercer metacarpianos forman el eje fijo central de la mano, proporcionando estabilidad para las actividades de fuerza. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_fal_1', textoPregunta: 'A diferencia de los otros dedos, ¿cuántas falanges tiene el pulgar?', opciones: ['Una', 'Dos', 'Tres', 'Ninguna'], indiceRespuestaCorrecta: 1, explicacion: 'El pulgar (primer dedo) solo tiene dos falanges: proximal y distal. Los otros cuatro dedos tienen tres (proximal, media y distal), lo que les da una articulación adicional. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Fácil' },
    { id: 'ms_h_fal_2', textoPregunta: '¿Cuántas falanges hay en total en una mano?', opciones: ['12', '14', '15', '16'], indiceRespuestaCorrecta: 1, explicacion: 'Hay 14 falanges en total: 2 en el pulgar (proximal y distal) y 3 en cada uno de los otros cuatro dedos (proximal, media y distal). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_3', textoPregunta: '¿Cuál es la falange más robusta?', opciones: ['Falange proximal del pulgar', 'Falange distal del índice', 'Falange media del medio', 'Falange proximal del índice'], indiceRespuestaCorrecta: 0, explicacion: 'La falange proximal del pulgar es la más robusta debido a las fuerzas que debe soportar durante la oposición y prensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_4', textoPregunta: '¿Qué característica tienen las falanges distales?', opciones: ['Son las más largas', 'Tienen tuberosidad ungueal', 'Solo se articulan proximalmente', 'Son simétricas'], indiceRespuestaCorrecta: 1, explicacion: 'Las falanges distales presentan una tuberosidad ungueal en su extremo distal que sirve de soporte para la uña. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_5', textoPregunta: '¿Cuáles son las falanges más susceptibles a fracturas?', opciones: ['Proximales', 'Medias', 'Distales', 'Todas por igual'], indiceRespuestaCorrecta: 2, explicacion: 'Las falanges distales son las más susceptibles a fracturas debido a su exposición en traumatismos de los dedos, especialmente lesiones por aplastamiento. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },

    // Preguntas adicionales expandidas sobre músculos (integradas en Huesos del carpo)
    { id: 'ms_h_car_26', textoPregunta: '¿Cuál es la principal función del músculo deltoides?', opciones: ['Flexión del codo', 'Abducción del hombro', 'Extensión de la muñeca', 'Pronación del antebrazo'], indiceRespuestaCorrecta: 1, explicacion: 'El deltoides es el principal abductor del hombro, elevando el brazo lateralmente. Sus fibras anteriores flexionan y las posteriores extienden. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_27', textoPregunta: '¿Cuántas porciones tiene el músculo deltoides?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], indiceRespuestaCorrecta: 1, explicacion: 'El deltoides tiene tres porciones: anterior (clavicular), media (acromial) y posterior (espinal), cada una con funciones específicas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_28', textoPregunta: '¿Qué nervio inerva al músculo deltoides?', opciones: ['Nervio axilar', 'Nervio radial', 'Nervio mediano', 'Nervio musculocutáneo'], indiceRespuestaCorrecta: 0, explicacion: 'El nervio axilar (C5-C6) inerva tanto al deltoides como al redondo menor, siendo vulnerable en fracturas del cuello quirúrgico del húmero. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_29', textoPregunta: '¿Dónde se inserta el músculo deltoides?', opciones: ['Epicóndilo lateral', 'Tuberosidad deltoidea del húmero', 'Acromion', 'Apófisis coracoides'], indiceRespuestaCorrecta: 1, explicacion: 'El deltoides se inserta en la tuberosidad deltoidea, ubicada en la cara lateral del tercio medio de la diáfisis humeral. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_30', textoPregunta: '¿Cuál es el rango de abducción del deltoides?', opciones: ['0-30 grados', '15-90 grados', '30-120 grados', '90-180 grados'], indiceRespuestaCorrecta: 1, explicacion: 'El deltoides es efectivo en la abducción desde los 15° hasta los 90°. Los primeros 15° son realizados por el supraespinoso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },

    // Preguntas adicionales sobre función muscular (integradas en Metacarpianos)
    { id: 'ms_h_met_11', textoPregunta: '¿Cuántos músculos forman el manguito rotador?', opciones: ['Tres', 'Cuatro', 'Cinco', 'Seis'], indiceRespuestaCorrecta: 1, explicacion: 'El manguito rotador está formado por cuatro músculos: supraespinoso, infraespinoso, redondo menor y subescapular. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_12', textoPregunta: '¿Cuál es la función principal del manguito rotador?', opciones: ['Flexión del codo', 'Estabilización glenohumeral', 'Extensión de muñeca', 'Pronación'], indiceRespuestaCorrecta: 1, explicacion: 'La función principal del manguito rotador es estabilizar la articulación glenohumeral manteniendo la cabeza humeral centrada en la glenoides. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_13', textoPregunta: '¿Cuál músculo del manguito rotador se lesiona más frecuentemente?', opciones: ['Supraespinoso', 'Infraespinoso', 'Redondo menor', 'Subescapular'], indiceRespuestaCorrecta: 0, explicacion: 'El supraespinoso es el más vulnerable debido a su paso por el espacio subacromial y su vascularización crítica cerca de la inserción. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_14', textoPregunta: '¿Qué músculo inicia la abducción del hombro?', opciones: ['Deltoides', 'Supraespinoso', 'Infraespinoso', 'Subescapular'], indiceRespuestaCorrecta: 1, explicacion: 'El supraespinoso inicia la abducción (primeros 15°) antes de que el deltoides tome el control del movimiento. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_15', textoPregunta: '¿Dónde se insertan los músculos del manguito rotador?', opciones: ['Epicóndilos del húmero', 'Troquíter y troquín del húmero', 'Diáfisis humeral', 'Cuello anatómico'], indiceRespuestaCorrecta: 1, explicacion: 'Los músculos del manguito rotador se insertan en las tuberosidades del húmero: supraespinoso, infraespinoso y redondo menor en el troquíter; subescapular en el troquín. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_16', textoPregunta: '¿Qué es el síndrome de impingement?', opciones: ['Fractura del acromion', 'Compresión del manguito rotador', 'Luxación del hombro', 'Artritis glenohumeral'], indiceRespuestaCorrecta: 1, explicacion: 'El impingement es la compresión del manguito rotador entre la cabeza humeral y el arco coracoacromial durante la elevación del brazo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_17', textoPregunta: '¿Cuál es la función específica del infraespinoso?', opciones: ['Rotación interna', 'Rotación externa', 'Abducción', 'Flexión'], indiceRespuestaCorrecta: 1, explicacion: 'El infraespinoso es el principal rotador externo del hombro, trabajando junto con el redondo menor. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_18', textoPregunta: '¿Qué nervio inerva al supraespinoso?', opciones: ['Nervio supraescapular', 'Nervio axilar', 'Nervio torácico largo', 'Nervio subescapular'], indiceRespuestaCorrecta: 0, explicacion: 'El nervio supraescapular (C5-C6) inerva tanto al supraespinoso como al infraespinoso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_19', textoPregunta: '¿Cuál es la función del subescapular?', opciones: ['Rotación externa', 'Rotación interna', 'Abducción', 'Extensión'], indiceRespuestaCorrecta: 1, explicacion: 'El subescapular es el principal rotador interno del hombro y también contribuye a la estabilidad anterior de la articulación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_20', textoPregunta: '¿Qué test evalúa específicamente el supraespinoso?', opciones: ['Test de Neer', 'Test de lata vacía (Jobe)', 'Test de Hawkins', 'Test de Speed'], indiceRespuestaCorrecta: 1, explicacion: 'El test de la lata vacía (Jobe test) evalúa específicamente la función del supraespinoso con el brazo en abducción y rotación interna. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_21', textoPregunta: '¿Cuál es la clasificación de las fracturas de metacarpianos según su localización?', opciones: ['Proximal, media, distal', 'Cabeza, cuello, diáfisis, base', 'Articular, extraarticular', 'Estables, inestables'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas de metacarpianos se clasifican anatómicamente en fracturas de cabeza, cuello, diáfisis y base, cada una con implicaciones terapéuticas específicas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_22', textoPregunta: '¿Qué deformidad angular es aceptable en fracturas del cuello del quinto metacarpiano?', opciones: ['10 grados', '20 grados', '40 grados', '60 grados'], indiceRespuestaCorrecta: 2, explicacion: 'En fracturas del cuello del quinto metacarpiano (fractura de boxeador) se acepta hasta 40° de angulación debido a la mayor movilidad de esta articulación carpometacarpiana. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_23', textoPregunta: '¿Cuál es la complicación más común de las fracturas diafisarias de metacarpianos?', opciones: ['Pseudoartrosis', 'Rigidez digital', 'Infección', 'Acortamiento'], indiceRespuestaCorrecta: 1, explicacion: 'La rigidez digital es la complicación más frecuente debido a adherencias tendinosas y capsulares, especialmente si la inmovilización es prolongada. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_24', textoPregunta: '¿Qué estructura anatómica previene el colapso del arco transverso metacarpiano?', opciones: ['Ligamentos intermetacarpianos', 'Músculos interóseos', 'Ligamento metacarpiano transverso profundo', 'Aponeurosis palmar'], indiceRespuestaCorrecta: 2, explicacion: 'El ligamento metacarpiano transverso profundo conecta las cabezas de los metacarpianos y mantiene la integridad del arco transverso de la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_25', textoPregunta: '¿Cuál es el metacarpiano más susceptible a fractura por stress?', opciones: ['Segundo', 'Tercero', 'Cuarto', 'Quinto'], indiceRespuestaCorrecta: 1, explicacion: 'El segundo metacarpiano es el más susceptible a fracturas por stress debido a su mayor longitud y a las fuerzas repetitivas en actividades deportivas o laborales. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_26', textoPregunta: '¿Cuál es la técnica quirúrgica más utilizada para fracturas diafisarias de metacarpianos?', opciones: ['Placas de compresión', 'Enclavado intramedular', 'Fijación externa', 'Agujas de Kirschner'], indiceRespuestaCorrecta: 3, explicacion: 'Las agujas de Kirschner son la técnica más utilizada para fracturas diafisarias de metacarpianos por su simplicidad, bajo costo y buenos resultados funcionales. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_27', textoPregunta: '¿Qué músculos interóseos se insertan en el segundo metacarpiano?', opciones: ['Solo palmares', 'Solo dorsales', 'Primer interóseo palmar y primer dorsal', 'Ninguno'], indiceRespuestaCorrecta: 2, explicacion: 'El segundo metacarpiano recibe la inserción del primer interóseo palmar (aducción) y del primer interóseo dorsal (abducción radial). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_28', textoPregunta: '¿Cuál es el signo radiológico característico de una fractura en espiral de metacarpiano?', opciones: ['Línea de fractura transversa', 'Patrón helicoidal', 'Fragmentos múltiples', 'Acortamiento severo'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas en espiral muestran un patrón helicoidal en las radiografías, típico de mecanismos de torsión combinada con carga axial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_29', textoPregunta: '¿Qué tiempo de inmovilización es recomendado para fracturas estables de metacarpiano?', opciones: ['1-2 semanas', '3-4 semanas', '6-8 semanas', '10-12 semanas'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas estables de metacarpiano requieren 3-4 semanas de inmovilización, seguidas de movilización temprana para prevenir rigidez. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_30', textoPregunta: '¿Cuál es la principal diferencia biomecánica entre el primer metacarpiano y los demás?', opciones: ['Mayor longitud', 'Más movilidad articular', 'Mayor grosor cortical', 'Vascularización diferente'], indiceRespuestaCorrecta: 1, explicacion: 'El primer metacarpiano tiene mayor movilidad articular debido a la articulación carpometacarpiana en silla de montar, permitiendo la oposición del pulgar. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_31', textoPregunta: '¿Qué estructura anatómica conecta las bases de los metacarpianos?', opciones: ['Ligamentos colaterales', 'Ligamentos intermetacarpianos', 'Aponeurosis palmar', 'Ligamentos carpianos'], indiceRespuestaCorrecta: 1, explicacion: 'Los ligamentos intermetacarpianos conectan las bases de los metacarpianos 2º a 5º, proporcionando estabilidad en el arco transverso proximal. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_32', textoPregunta: '¿Cuál es la complicación más frecuente de las fracturas del cuello del metacarpiano?', opciones: ['Pseudoartrosis', 'Angulación dorsal', 'Infección', 'Ruptura tendinosa'], indiceRespuestaCorrecta: 1, explicacion: 'La angulación dorsal es la complicación más frecuente de las fracturas del cuello del metacarpiano, especialmente en el 5º metacarpiano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_33', textoPregunta: '¿Qué estructura vascular irriga principalmente las cabezas de los metacarpianos?', opciones: ['Arterias digitales palmares', 'Arco palmar superficial', 'Arterias metacarpianas dorsales', 'Arterias perforantes'], indiceRespuestaCorrecta: 2, explicacion: 'Las arterias metacarpianas dorsales, ramas del arco palmar profundo, proporcionan la irrigación principal a las cabezas de los metacarpianos. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_34', textoPregunta: '¿Cuál es el criterio radiológico para indicar reducción en fracturas de metacarpiano?', opciones: ['Cualquier angulación', 'Angulación >15° en 2º-3º, >30° en 4º, >40° en 5º', 'Solo si hay desplazamiento lateral', 'Acortamiento >1cm'], indiceRespuestaCorrecta: 1, explicacion: 'Los criterios de angulación aceptable varían según el metacarpiano: 15° para 2º-3º, 30° para 4º, y 40° para 5º metacarpiano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_35', textoPregunta: '¿Qué músculo se origina en la base del primer metacarpiano?', opciones: ['Oponente del pulgar', 'Aductor del pulgar', 'Flexor corto del pulgar', 'Ninguno'], indiceRespuestaCorrecta: 3, explicacion: 'Ningún músculo se origina en la base del primer metacarpiano; los músculos tenares se originan en el carpo y se insertan en las falanges. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_36', textoPregunta: '¿Cuál es la clasificación de las fracturas de la base del primer metacarpiano?', opciones: ['Clasificación de Bennett y Rolando', 'Clasificación de Mason', 'Clasificación de Salter-Harris', 'Clasificación de Garden'], indiceRespuestaCorrecta: 0, explicacion: 'Las fracturas de la base del primer metacarpiano se clasifican como Bennett (fractura-luxación simple) y Rolando (fractura conminuta). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_37', textoPregunta: '¿Qué es una fractura de Bennett?', opciones: ['Fractura de cabeza de metacarpiano', 'Fractura-luxación de base del primer metacarpiano', 'Fractura de cuello', 'Fractura diafisaria'], indiceRespuestaCorrecta: 1, explicacion: 'La fractura de Bennett es una fractura-luxación oblicua de la base del primer metacarpiano que involucra la articulación carpometacarpiana. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_38', textoPregunta: '¿Cuál es la diferencia entre fractura de Bennett y de Rolando?', opciones: ['Localización diferente', 'Bennett es simple, Rolando es conminuta', 'Diferentes metacarpianos', 'Mecanismo de lesión'], indiceRespuestaCorrecta: 1, explicacion: 'Ambas afectan la base del primer metacarpiano, pero Bennett es una fractura simple y Rolando es conminuta en "Y" o "T". [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_39', textoPregunta: '¿Qué ligamento es crucial en la estabilidad de la fractura de Bennett?', opciones: ['Ligamento colateral radial', 'Ligamento oblicuo anterior (beak)', 'Ligamento intermetacarpiano', 'Ligamento carpometacarpiano dorsal'], indiceRespuestaCorrecta: 1, explicacion: 'El ligamento oblicuo anterior (beak ligament) mantiene el fragmento ulnar en posición mientras el resto del metacarpiano se luxa. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_40', textoPregunta: '¿Cuál es el tratamiento de elección para una fractura de Bennett?', opciones: ['Inmovilización simple', 'Reducción cerrada y fijación percutánea', 'Tracción esquelética', 'Tratamiento conservador'], indiceRespuestaCorrecta: 1, explicacion: 'La fractura de Bennett requiere reducción cerrada y fijación percutánea con agujas de Kirschner para mantener la reducción articular. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_41', textoPregunta: '¿Qué músculo contribuye más a la deformidad en fracturas de Bennett?', opciones: ['Aductor largo del pulgar', 'Abductor largo del pulgar', 'Flexor largo del pulgar', 'Extensor largo del pulgar'], indiceRespuestaCorrecta: 1, explicacion: 'El abductor largo del pulgar tracciona el fragmento principal del metacarpiano hacia proximal y radial, contribuyendo a la deformidad. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_42', textoPregunta: '¿Cuál es la complicación tardía más temida de las fracturas de Bennett mal tratadas?', opciones: ['Rigidez', 'Artrosis carpometacarpiana', 'Pseudoartrosis', 'Síndrome compartimental'], indiceRespuestaCorrecta: 1, explicacion: 'La artrosis carpometacarpiana del pulgar es la complicación más temida por la pérdida funcional severa que conlleva para la prensión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_43', textoPregunta: '¿Qué proyección radiológica es esencial para evaluar fracturas de Bennett?', opciones: ['AP de mano', 'Lateral estricta', 'Proyección de Robert (AP verdadera del pulgar)', 'Oblicua'], indiceRespuestaCorrecta: 2, explicacion: 'La proyección de Robert (AP verdadera del pulgar) es esencial para evaluar la articulación carpometacarpiana y el grado de subluxación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_44', textoPregunta: '¿Cuál es el mecanismo de lesión típico de las fracturas de metacarpianos?', opciones: ['Caída sobre mano extendida', 'Puñetazo (impacto axial)', 'Torsión pura', 'Aplastamiento'], indiceRespuestaCorrecta: 1, explicacion: 'El puñetazo o impacto axial es el mecanismo más común, especialmente para fracturas del cuello del 5º metacarpiano (fractura de boxeador). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },
    { id: 'ms_h_met_45', textoPregunta: '¿Qué factor determina principalmente el pronóstico en fracturas de metacarpianos?', opciones: ['Edad del paciente', 'Localización y estabilidad de la fractura', 'Mecanismo de lesión', 'Tiempo hasta la cirugía'], indiceRespuestaCorrecta: 1, explicacion: 'La localización (articular vs extraarticular) y la estabilidad de la fractura son los principales determinantes del pronóstico funcional. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_46', textoPregunta: '¿Cuál es la posición óptima de inmovilización para fracturas de metacarpianos?', opciones: ['Mano plana', 'Posición intrínseca plus', 'Muñeca en flexión', 'Posición de función'], indiceRespuestaCorrecta: 1, explicacion: 'La posición intrínseca plus (MCF en flexión 70°-90°, IFP en extensión) previene la rigidez de los ligamentos colaterales. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Difícil' },
    { id: 'ms_h_met_47', textoPregunta: '¿Qué estructura debe evaluarse siempre en fracturas del 5º metacarpiano?', opciones: ['Nervio cubital', 'Articulación carpometacarpiana', 'Tendones extensores', 'Todas las anteriores'], indiceRespuestaCorrecta: 3, explicacion: 'En fracturas del 5º metacarpiano debe evaluarse la integridad del nervio cubital, la articulación carpometacarpiana y los tendones extensores. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_48', textoPregunta: '¿Cuál es la indicación principal para placas en fracturas de metacarpianos?', opciones: ['Todas las fracturas', 'Fracturas múltiples o inestables', 'Solo fracturas abiertas', 'Fracturas en deportistas'], indiceRespuestaCorrecta: 1, explicacion: 'Las placas están indicadas en fracturas múltiples, inestables, conminutas o cuando se requiere movilización temprana. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_49', textoPregunta: '¿Qué complicación específica puede ocurrir tras fijación con agujas de Kirschner?', opciones: ['Ruptura de placa', 'Infección del trayecto de las agujas', 'Pseudoartrosis', 'Síndrome compartimental'], indiceRespuestaCorrecta: 1, explicacion: 'La infección del trayecto de las agujas es una complicación específica de este método de fijación, especialmente si se dejan expuestas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Media' },
    { id: 'ms_h_met_50', textoPregunta: '¿Cuál es el objetivo principal del tratamiento en fracturas de metacarpianos?', opciones: ['Consolidación ósea perfecta', 'Restauración de la función de prensión', 'Prevención del dolor', 'Evitar cirugía'], indiceRespuestaCorrecta: 1, explicacion: 'El objetivo principal es restaurar la función de prensión y pinza, más que lograr una reducción anatómica perfecta. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Metacarpianos' }, dificultad: 'Fácil' },

    // Preguntas adicionales sobre bíceps (integradas en Falanges)
    { id: 'ms_h_fal_6', textoPregunta: '¿Cuántas cabezas tiene el músculo bíceps braquial?', opciones: ['Una', 'Dos', 'Tres', 'Cuatro'], indiceRespuestaCorrecta: 1, explicacion: 'El bíceps braquial tiene dos cabezas: la cabeza larga que se origina en el tubérculo supraglenoideo y la cabeza corta en la apófisis coracoides. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Fácil' },
    { id: 'ms_h_fal_7', textoPregunta: '¿Cuáles son las principales funciones del bíceps braquial?', opciones: ['Solo flexión del codo', 'Flexión del codo y supinación', 'Solo supinación', 'Extensión del codo'], indiceRespuestaCorrecta: 1, explicacion: 'El bíceps braquial flexiona el codo y es el supinador más potente del antebrazo, especialmente con el codo flexionado. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Fácil' },
    { id: 'ms_h_fal_8', textoPregunta: '¿Dónde se inserta el bíceps braquial?', opciones: ['Epicóndilo medial', 'Tuberosidad del radio', 'Olécranon', 'Apófisis estiloides'], indiceRespuestaCorrecta: 1, explicacion: 'El bíceps braquial se inserta principalmente en la tuberosidad del radio y secundariamente en la fascia del antebrazo a través de la aponeurosis bicipital. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_9', textoPregunta: '¿Qué nervio inerva al bíceps braquial?', opciones: ['Nervio radial', 'Nervio mediano', 'Nervio musculocutáneo', 'Nervio cubital'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio musculocutáneo (C5-C7) inerva el bíceps braquial, así como el coracobraquial y la mayor parte del braquial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_10', textoPregunta: '¿Cuál es la lesión más común del tendón del bíceps?', opciones: ['Ruptura de cabeza corta', 'Ruptura de cabeza larga', 'Tendinitis de inserción', 'Avulsión radial'], indiceRespuestaCorrecta: 1, explicacion: 'La ruptura de la cabeza larga del bíceps es más común debido a su paso por el surco intertubercular y su función estabilizadora del hombro. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Difícil' },
    { id: 'ms_h_fal_11', textoPregunta: '¿Cuál es la diferencia principal entre una fractura de falange estable e inestable?', opciones: ['Localización', 'Desplazamiento y capacidad de reducción', 'Edad del paciente', 'Mecanismo de lesión'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas estables mantienen la alineación después de la reducción, mientras que las inestables tienden a desplazarse y requieren fijación interna. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_12', textoPregunta: '¿Qué complicación es más temida en fracturas abiertas de falanges?', opciones: ['Pseudoartrosis', 'Osteomielitis', 'Rigidez articular', 'Acortamiento'], indiceRespuestaCorrecta: 1, explicacion: 'La osteomielitis es especialmente preocupante en fracturas abiertas de falanges debido a la escasa cobertura de tejidos blandos y vascularización limitada. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Difícil' },
    { id: 'ms_h_fal_13', textoPregunta: '¿Cuál es el tratamiento de elección para una fractura articular desplazada de falange proximal?', opciones: ['Inmovilización conservadora', 'Reducción abierta y fijación interna', 'Tracción continua', 'Férula dinámica'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas articulares desplazadas requieren reducción anatómica y fijación estable para prevenir artritis post-traumática. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_14', textoPregunta: '¿Qué deformidad es característica de una lesión del tendón flexor profundo (jersey finger)?', opciones: ['Dedo en martillo', 'Dedo en cuello de cisne', 'Pérdida de flexión DIP', 'Dedo en boutonniere'], indiceRespuestaCorrecta: 2, explicacion: 'La avulsión del flexor profundo causa pérdida de la flexión de la articulación interfalángica distal (DIP), manteniendo la flexión PIP. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },
    { id: 'ms_h_fal_15', textoPregunta: '¿Cuál es la causa más común de la deformidad en "dedo en martillo"?', opciones: ['Fractura de falange media', 'Lesión del extensor terminal', 'Ruptura del flexor superficial', 'Luxación interfalángica'], indiceRespuestaCorrecta: 1, explicacion: 'El dedo en martillo resulta de la ruptura o avulsión del tendón extensor terminal, causando caída de la falange distal en flexión. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Falanges' }, dificultad: 'Media' },

    // Preguntas adicionales sobre neuroanatomía (integradas en Clavícula)
    { id: 'ms_h_cla_3', textoPregunta: '¿Cuántas raíces nerviosas forman el plexo braquial?', opciones: ['Cuatro', 'Cinco', 'Seis', 'Siete'], indiceRespuestaCorrecta: 1, explicacion: 'El plexo braquial está formado por cinco raíces nerviosas: C5, C6, C7, C8 y T1, que se organizan en troncos, divisiones, fascículos y nervios terminales. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Fácil' },
    { id: 'ms_h_cla_4', textoPregunta: '¿Cuáles son los tres troncos del plexo braquial?', opciones: ['Anterior, medio y posterior', 'Superior, medio e inferior', 'Medial, lateral y posterior', 'Proximal, medio y distal'], indiceRespuestaCorrecta: 1, explicacion: 'Los tres troncos del plexo braquial son: superior (C5-C6), medio (C7) e inferior (C8-T1). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Media' },
    { id: 'ms_h_cla_5', textoPregunta: '¿Qué nervio se origina directamente del tronco superior?', opciones: ['Nervio axilar', 'Nervio supraescapular', 'Nervio mediano', 'Nervio radial'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio supraescapular se origina directamente del tronco superior (C5-C6) e inerva el supraespinoso e infraespinoso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Difícil' },
    { id: 'ms_h_cla_6', textoPregunta: '¿Cuál es la función principal del nervio mediano en la mano?', opciones: ['Sensibilidad del meñique', 'Oposición del pulgar', 'Extensión de dedos', 'Abducción de dedos'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio mediano controla la oposición del pulgar a través de los músculos tenares, función esencial para la prensión fina. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Fácil' },
    { id: 'ms_h_cla_7', textoPregunta: '¿Cuál es la función principal del nervio radial?', opciones: ['Flexión de muñeca', 'Extensión de muñeca y dedos', 'Oposición del pulgar', 'Abducción de dedos'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio radial es el principal extensor de la muñeca y dedos, controlando toda la musculatura extensora del antebrazo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Fácil' },
    { id: 'ms_h_cla_8', textoPregunta: '¿Cuál es la clasificación de Allman para fracturas de clavícula?', opciones: ['Tipo I, II, III según localización', 'Grado A, B, C según gravedad', 'Clase 1, 2, 3 según desplazamiento', 'Estadio temprano, medio, tardío'], indiceRespuestaCorrecta: 0, explicacion: 'La clasificación de Allman divide las fracturas de clavícula en: Tipo I (tercio medio), Tipo II (tercio distal), Tipo III (tercio proximal). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Difícil' },
    { id: 'ms_h_cla_9', textoPregunta: '¿Cuál es la complicación vascular más temida en fracturas de clavícula?', opciones: ['Trombosis venosa', 'Lesión de arteria subclavia', 'Hematoma local', 'Síndrome compartimental'], indiceRespuestaCorrecta: 1, explicacion: 'La lesión de la arteria subclavia es rara pero grave, especialmente en fracturas del tercio proximal con gran desplazamiento. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Difícil' },
    { id: 'ms_h_cla_10', textoPregunta: '¿Qué criterios se usan para indicar cirugía en fracturas de clavícula del tercio medio?', opciones: ['Edad mayor de 65 años', 'Acortamiento mayor de 2cm y tenting de piel', 'Solo fracturas abiertas', 'Todas las fracturas'], indiceRespuestaCorrecta: 1, explicacion: 'La cirugía se indica ante acortamiento >2cm, tenting de piel, compromiso neurovascular o fracturas abiertas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Difícil' },
    { id: 'ms_h_cla_11', textoPregunta: '¿Cuál es el síndrome clínico asociado a parálisis de C5-C6?', opciones: ['Parálisis de Klumpke', 'Parálisis de Erb-Duchenne', 'Síndrome de Horner', 'Parálisis total del plexo'], indiceRespuestaCorrecta: 1, explicacion: 'La parálisis de Erb-Duchenne afecta C5-C6, causando pérdida de abducción del hombro, flexión del codo y supinación (posición de "propina"). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Media' },
    { id: 'ms_h_cla_12', textoPregunta: '¿Qué test clínico evalúa la integridad del nervio supraescapular?', opciones: ['Test de Jobe', 'Test de Neer', 'Test de la fosa supraespinosa', 'Test de Speed'], indiceRespuestaCorrecta: 2, explicacion: 'La palpación de la fosa supraespinosa revela atrofia del supraespinoso en lesiones crónicas del nervio supraescapular. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Clavícula' }, dificultad: 'Difícil' },

    // Preguntas adicionales sobre vascularización (integradas en Escápula)
    { id: 'ms_h_esc_3', textoPregunta: '¿Cuál es la arteria principal del miembro superior?', opciones: ['Arteria braquial', 'Arteria axilar', 'Arteria subclavia', 'Arteria radial'], indiceRespuestaCorrecta: 2, explicacion: 'La arteria subclavia es la arteria principal que irriga el miembro superior, continuándose como axilar al pasar por la primera costilla. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Fácil' },
    { id: 'ms_h_esc_4', textoPregunta: '¿Cuántos arcos arteriales palmares existen?', opciones: ['Uno', 'Dos', 'Tres', 'Cuatro'], indiceRespuestaCorrecta: 1, explicacion: 'Existen dos arcos arteriales palmares: el arco palmar superficial y el arco palmar profundo, que irrigan la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Fácil' },
    { id: 'ms_h_esc_5', textoPregunta: '¿Qué arteria forma principalmente el arco palmar superficial?', opciones: ['Arteria radial', 'Arteria cubital', 'Arteria interósea', 'Arteria braquial'], indiceRespuestaCorrecta: 1, explicacion: 'El arco palmar superficial está formado principalmente por la arteria cubital, con una contribución variable de la arteria radial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Media' },
    { id: 'ms_h_esc_6', textoPregunta: '¿Cuáles son los dos sistemas venosos principales del miembro superior?', opciones: ['Arterial y venoso', 'Superficial y profundo', 'Radial y cubital', 'Proximal y distal'], indiceRespuestaCorrecta: 1, explicacion: 'El drenaje venoso del miembro superior se organiza en dos sistemas: superficial (subcutáneo) y profundo (que acompaña a las arterias). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Fácil' },
    { id: 'ms_h_esc_7', textoPregunta: '¿Cuál es la vena superficial más prominente del brazo?', opciones: ['Vena basílica', 'Vena cefálica', 'Vena mediana', 'Vena braquial'], indiceRespuestaCorrecta: 1, explicacion: 'La vena cefálica es la vena superficial más prominente del brazo, siendo fácilmente visible y palpable en personas delgadas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Media' },
    { id: 'ms_h_esc_8', textoPregunta: '¿Cuál es la clasificación de fracturas de escápula más utilizada?', opciones: ['Clasificación de AO', 'Clasificación de Ideberg', 'Clasificación de Neer', 'Clasificación de Anderson'], indiceRespuestaCorrecta: 1, explicacion: 'La clasificación de Ideberg se usa para fracturas de la cavidad glenoidea, dividiéndolas en 6 tipos según el patrón de fractura. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Difícil' },
    { id: 'ms_h_esc_9', textoPregunta: '¿Cuál es la indicación más común para cirugía en fracturas de escápula?', opciones: ['Todas las fracturas', 'Fracturas desplazadas de cavidad glenoidea', 'Solo fracturas del cuerpo', 'Fracturas del acromion'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas desplazadas de la cavidad glenoidea (>4mm o >25% de superficie articular) requieren reducción para prevenir inestabilidad y artritis. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Difícil' },
    { id: 'ms_h_esc_10', textoPregunta: '¿Qué músculo se origina en la fosa infraespinosa?', opciones: ['Supraespinoso', 'Infraespinoso', 'Subescapular', 'Redondo mayor'], indiceRespuestaCorrecta: 1, explicacion: 'El músculo infraespinoso se origina en la fosa infraespinosa y es uno de los rotadores externos del hombro. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Fácil' },
    { id: 'ms_h_esc_11', textoPregunta: '¿Cuál es la complicación más frecuente de las fracturas de escápula?', opciones: ['Pseudoartrosis', 'Rigidez del hombro', 'Lesión vascular', 'Infección'], indiceRespuestaCorrecta: 1, explicacion: 'La rigidez del hombro es la complicación más común debido a la inmovilización prolongada y adherencias capsulares. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Media' },
    { id: 'ms_h_esc_12', textoPregunta: '¿Qué estructura pasa por la escotadura escapular?', opciones: ['Arteria escapular', 'Nervio supraescapular', 'Vena escapular', 'Nervio axilar'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio supraescapular pasa por la escotadura escapular (bajo el ligamento transverso superior) para inervar supraespinoso e infraespinoso. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Escápula' }, dificultad: 'Media' },

    // Expandir subtema Húmero con preguntas de anatomía funcional
    { id: 'ms_h_hum_3', textoPregunta: '¿Cuál es la inserción del músculo pectoral mayor en el húmero?', opciones: ['Epicóndilo medial', 'Cresta del tubérculo mayor', 'Tuberosidad deltoidea', 'Epicóndilo lateral'], indiceRespuestaCorrecta: 1, explicacion: 'El pectoral mayor se inserta en la cresta del tubérculo mayor (troquíter), siendo un potente aductor y rotador interno del brazo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Media' },
    { id: 'ms_h_hum_4', textoPregunta: '¿Qué músculo se inserta en la tuberosidad deltoidea del húmero?', opciones: ['Pectoral mayor', 'Deltoides', 'Bíceps braquial', 'Tríceps braquial'], indiceRespuestaCorrecta: 1, explicacion: 'El músculo deltoides se inserta en la tuberosidad deltoidea, localizada en la cara lateral del tercio medio de la diáfisis humeral. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Fácil' },
    { id: 'ms_h_hum_5', textoPregunta: '¿Cuál es la complicación nerviosa más común en fracturas del tercio medio del húmero?', opciones: ['Lesión del nervio mediano', 'Lesión del nervio radial', 'Lesión del nervio cubital', 'Lesión del nervio axilar'], indiceRespuestaCorrecta: 1, explicacion: 'El nervio radial pasa por el surco espiral del húmero y es vulnerable en fracturas del tercio medio de la diáfisis humeral. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Difícil' },
    { id: 'ms_h_hum_6', textoPregunta: '¿Qué estructura pasa por el surco intertubercular del húmero?', opciones: ['Nervio axilar', 'Tendón de la cabeza larga del bíceps', 'Arteria humeral', 'Nervio radial'], indiceRespuestaCorrecta: 1, explicacion: 'El tendón de la cabeza larga del bíceps braquial pasa por el surco intertubercular (corredera bicipital) del húmero. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Media' },
    { id: 'ms_h_hum_7', textoPregunta: '¿Cuál es la función principal del epicóndilo medial del húmero?', opciones: ['Inserción de extensores', 'Inserción de flexores del antebrazo', 'Articulación con el radio', 'Paso de nervios'], indiceRespuestaCorrecta: 1, explicacion: 'El epicóndilo medial del húmero sirve como origen común de los músculos flexores del antebrazo y de la mano. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Media' },
    { id: 'ms_h_hum_8', textoPregunta: '¿Cuál es la clasificación de Neer para fracturas proximales de húmero?', opciones: ['Tipo A, B, C', 'Grado 1, 2, 3, 4', 'Clase I, II, III', 'Estadio temprano, tardío'], indiceRespuestaCorrecta: 1, explicacion: 'La clasificación de Neer divide las fracturas proximales de húmero en 1, 2, 3 o 4 partes según los fragmentos desplazados (cabeza, troquíter, troquín, diáfisis). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Difícil' },
    { id: 'ms_h_hum_9', textoPregunta: '¿Cuál es la complicación más temida en fracturas de 4 partes del húmero proximal?', opciones: ['Rigidez', 'Necrosis avascular de la cabeza humeral', 'Pseudoartrosis', 'Lesión nerviosa'], indiceRespuestaCorrecta: 1, explicacion: 'La necrosis avascular de la cabeza humeral es frecuente en fracturas de 4 partes debido a la interrupción del aporte vascular. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Difícil' },
    { id: 'ms_h_hum_10', textoPregunta: '¿Qué arteria es la principal irrigación de la cabeza humeral?', opciones: ['Arteria axilar', 'Arteria humeral anterior circunfleja', 'Arteria humeral posterior circunfleja', 'Arteria braquial'], indiceRespuestaCorrecta: 1, explicacion: 'La arteria humeral anterior circunfleja (arcuata) es la principal fuente de irrigación de la cabeza humeral a través de ramas intraóseas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Difícil' },
    { id: 'ms_h_hum_11', textoPregunta: '¿Cuál es el tratamiento de elección para fracturas de húmero proximal de 2 partes desplazadas?', opciones: ['Siempre conservador', 'Reducción abierta y fijación interna', 'Prótesis total', 'Inmovilización simple'], indiceRespuestaCorrecta: 1, explicacion: 'Las fracturas de 2 partes desplazadas usualmente requieren RAFI para restaurar la anatomía y función del hombro. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Media' },
    { id: 'ms_h_hum_12', textoPregunta: '¿Qué nervio es más vulnerable en luxaciones anteriores de hombro?', opciones: ['Nervio radial', 'Nervio mediano', 'Nervio axilar', 'Nervio musculocutáneo'], indiceRespuestaCorrecta: 2, explicacion: 'El nervio axilar es vulnerable en luxaciones anteriores debido a su curso alrededor del cuello quirúrgico del húmero. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Húmero' }, dificultad: 'Media' },

    // Expandir subtema Radio con más preguntas
    { id: 'ms_h_rad_3', textoPregunta: '¿Cuál es la función principal de la tuberosidad del radio?', opciones: ['Articulación con el húmero', 'Inserción del bíceps braquial', 'Paso de tendones', 'Inserción del supinador'], indiceRespuestaCorrecta: 1, explicacion: 'La tuberosidad del radio es el sitio de inserción principal del músculo bíceps braquial, siendo crucial para la flexión del codo y supinación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Fácil' },
    { id: 'ms_h_rad_4', textoPregunta: '¿Qué movimiento permite la articulación entre la cabeza del radio y el capítulo del húmero?', opciones: ['Solo flexión', 'Solo rotación', 'Flexión y rotación', 'Solo extensión'], indiceRespuestaCorrecta: 2, explicacion: 'La articulación radiocapitelar permite tanto la flexo-extensión del codo como la rotación del radio durante la pronosupinación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Media' },
    { id: 'ms_h_rad_5', textoPregunta: '¿Cuál es la importancia clínica de la apófisis estiloides del radio?', opciones: ['Inserción muscular', 'Referencia palpable', 'Articulación', 'Todas las anteriores'], indiceRespuestaCorrecta: 3, explicacion: 'La apófisis estiloides del radio sirve como inserción del braquiorradial, es fácilmente palpable y se usa como referencia anatómica clínica. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Media' },
    { id: 'ms_h_rad_6', textoPregunta: '¿Cuál es la clasificación más utilizada para fracturas distales de radio?', opciones: ['Clasificación de Neer', 'Clasificación de AO/ASIF', 'Clasificación de Weber', 'Clasificación de Garden'], indiceRespuestaCorrecta: 1, explicacion: 'La clasificación AO/ASIF divide las fracturas distales de radio en tipos A (extraarticular), B (articular parcial) y C (articular completa). [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Difícil' },
    { id: 'ms_h_rad_7', textoPregunta: '¿Cuál es la fractura distal de radio más común en adultos jóvenes?', opciones: ['Fractura de Colles', 'Fractura de Smith', 'Fractura de Barton', 'Fractura de Chauffeur'], indiceRespuestaCorrecta: 2, explicacion: 'La fractura de Barton (fractura-luxación articular) es más común en adultos jóvenes por traumatismos de alta energía. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Media' },
    { id: 'ms_h_rad_8', textoPregunta: '¿Qué complicación tardía es característica de fracturas mal reducidas del radio distal?', opciones: ['Infección', 'Síndrome compartimental', 'Deformidad en dorso de tenedor', 'Necrosis avascular'], indiceRespuestaCorrecta: 2, explicacion: 'La deformidad en "dorso de tenedor" resulta de la angulación dorsal y acortamiento radial en fracturas mal reducidas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Media' },
    { id: 'ms_h_rad_9', textoPregunta: '¿Cuál es el criterio radiológico más importante para la indicación quirúrgica en fracturas de radio distal?', opciones: ['Edad del paciente', 'Acortamiento radial >3mm', 'Dolor intenso', 'Edema severo'], indiceRespuestaCorrecta: 1, explicacion: 'El acortamiento radial >3mm, inclinación dorsal >10° o escalón articular >2mm son criterios para cirugía. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Difícil' },
    { id: 'ms_h_rad_10', textoPregunta: '¿Qué tendón es más susceptible a ruptura secundaria tras fractura de radio distal?', opciones: ['Tendón del flexor pollicis longus', 'Tendón del extensor pollicis longus', 'Tendón del braquiorradial', 'Tendón del flexor carpi radialis'], indiceRespuestaCorrecta: 1, explicacion: 'El extensor pollicis longus es susceptible a ruptura tardía por isquemia al rodear el tubérculo de Lister. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Radio' }, dificultad: 'Difícil' },
    // Expandir subtema Ulna con preguntas adicionales
    { id: 'ms_h_uln_3', textoPregunta: '¿Cuántas porciones tiene la arteria axilar?', opciones: ['Dos', 'Tres', 'Cuatro', 'Cinco'], indiceRespuestaCorrecta: 1, explicacion: 'La arteria axilar se divide en tres porciones según su relación con el músculo pectoral menor: primera, segunda y tercera porción. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Media' },
    { id: 'ms_h_uln_4', textoPregunta: '¿Qué arteria es la continuación directa de la axilar?', opciones: ['Arteria radial', 'Arteria cubital', 'Arteria braquial', 'Arteria interósea'], indiceRespuestaCorrecta: 2, explicacion: 'La arteria braquial es la continuación directa de la axilar, comenzando en el borde inferior del músculo redondo mayor. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Fácil' },
    { id: 'ms_h_uln_5', textoPregunta: '¿Dónde se divide la arteria braquial?', opciones: ['Axila', 'Tercio medio del brazo', 'Fosa cubital', 'Muñeca'], indiceRespuestaCorrecta: 2, explicacion: 'La arteria braquial se divide en sus ramas terminales (radial y cubital) en la fosa cubital, a nivel del cuello del radio. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Media' },
    { id: 'ms_h_uln_6', textoPregunta: '¿Cuál es la importancia clínica de la arteria braquial?', opciones: ['No es palpable', 'Sitio de toma de presión arterial', 'No tiene ramas', 'Solo irriga huesos'], indiceRespuestaCorrecta: 1, explicacion: 'La arteria braquial es el sitio estándar para la toma de presión arterial con esfigmomanómetro, siendo fácilmente palpable en el surco bicipital medial. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Fácil' },
    { id: 'ms_h_uln_7', textoPregunta: '¿Cuál es la función principal del olécranon?', opciones: ['Inserción del bíceps', 'Inserción del tríceps', 'Articulación con el radio', 'Inserción de flexores'], indiceRespuestaCorrecta: 1, explicacion: 'El olécranon es la prominencia posterior de la ulna donde se inserta el músculo tríceps braquial, proporcionando la extensión del codo. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Fácil' },
    { id: 'ms_h_uln_8', textoPregunta: '¿Qué estructura anatómica forma la "muesca troclear" de la ulna?', opciones: ['Olécranon y apófisis coronoides', 'Solo olécranon', 'Solo apófisis coronoides', 'Cabeza de la ulna'], indiceRespuestaCorrecta: 0, explicacion: 'La muesca troclear está formada por el olécranon (posterior) y la apófisis coronoides (anterior), articulándose con la tróclea del húmero. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Media' },
    { id: 'ms_h_uln_9', textoPregunta: '¿Cuál es la fractura más común del olécranon?', opciones: ['Fractura transversa simple', 'Fractura conminuta', 'Fractura-luxación', 'Fractura por avulsión'], indiceRespuestaCorrecta: 0, explicacion: 'La fractura transversa simple del olécranon es la más común, causada típicamente por caída directa sobre el codo flexionado. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Media' },
    { id: 'ms_h_uln_10', textoPregunta: '¿Cuál es el criterio principal para indicar cirugía en fracturas de olécranon?', opciones: ['Edad mayor de 60 años', 'Desplazamiento >2mm', 'Mecanismo de alta energía', 'Fractura bilateral'], indiceRespuestaCorrecta: 1, explicacion: 'El desplazamiento >2mm indica pérdida de la integridad del aparato extensor y requiere reducción abierta y fijación. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Difícil' },
    { id: 'ms_h_uln_11', textoPregunta: '¿Qué complicación es más frecuente tras osteosíntesis de olécranon?', opciones: ['Pseudoartrosis', 'Rigidez del codo', 'Infección', 'Prominencia de material'], indiceRespuestaCorrecta: 3, explicacion: 'La prominencia del material de osteosíntesis es común debido a la escasa cobertura de tejidos blandos sobre el olécranon. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Media' },
    { id: 'ms_h_uln_12', textoPregunta: '¿Cuál es la clasificación más utilizada para fracturas de coronoides?', opciones: ['Clasificación de Regan y Morrey', 'Clasificación de Mason', 'Clasificación de AO', 'Clasificación de Fernandez'], indiceRespuestaCorrecta: 0, explicacion: 'La clasificación de Regan y Morrey divide las fracturas de coronoides en tipos I, II y III según el tamaño del fragmento. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Difícil' },
    { id: 'ms_h_uln_13', textoPregunta: '¿Qué estructura anatómica es fundamental para la estabilidad anteroposterior del codo?', opciones: ['Ligamento colateral radial', 'Ligamento colateral cubital', 'Apófisis coronoides', 'Ligamento anular'], indiceRespuestaCorrecta: 2, explicacion: 'La apófisis coronoides es el principal estabilizador anteroposterior del codo, resistiendo la luxación posterior. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Ulna' }, dificultad: 'Difícil' },

    // Preguntas adicionales sobre vascularización integradas en diferentes subtemas
    { id: 'ms_h_car_41', textoPregunta: '¿Qué arteria forma principalmente el arco palmar profundo?', opciones: ['Arteria radial', 'Arteria cubital', 'Arteria interósea', 'Arteria braquial'], indiceRespuestaCorrecta: 0, explicacion: 'El arco palmar profundo está formado principalmente por la arteria radial, con contribución de la rama profunda de la arteria cubital. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_42', textoPregunta: '¿Cuál arco palmar está más superficial?', opciones: ['Arco profundo', 'Arco superficial', 'Ambos al mismo nivel', 'Varía según persona'], indiceRespuestaCorrecta: 1, explicacion: 'El arco palmar superficial está más superficial, ubicado inmediatamente por debajo de la aponeurosis palmar. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_43', textoPregunta: '¿Qué irrigan las arterias digitales palmares?', opciones: ['Solo uñas', 'Dedos de la mano', 'Solo articulaciones', 'Solo músculos'], indiceRespuestaCorrecta: 1, explicacion: 'Las arterias digitales palmares, que se originan de los arcos palmares, irrigan los dedos de la mano incluyendo piel, tejidos blandos y estructuras articulares. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Fácil' },
    { id: 'ms_h_car_44', textoPregunta: '¿Dónde desemboca la vena cefálica?', opciones: ['Vena axilar', 'Vena subclavia', 'Vena basílica', 'Vena yugular'], indiceRespuestaCorrecta: 1, explicacion: 'La vena cefálica desemboca en la vena subclavia, pasando por el surco deltopectoral y el triángulo clavipectoral. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_45', textoPregunta: '¿Cuál es la importancia clínica de la fosa cubital?', opciones: ['No tiene importancia', 'Sitio de venopunción', 'Solo para medir pulso', 'Solo para inyecciones'], indiceRespuestaCorrecta: 1, explicacion: 'La fosa cubital es el sitio preferido para venopunción debido a la presencia de venas superficiales prominentes y fácilmente accesibles. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_46', textoPregunta: '¿Qué conecta las venas superficiales y profundas?', opciones: ['Arterias', 'Venas perforantes', 'Linfáticos', 'Nervios'], indiceRespuestaCorrecta: 1, explicacion: 'Las venas perforantes conectan el sistema venoso superficial con el profundo, permitiendo el drenaje entre ambos sistemas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_47', textoPregunta: '¿Cuál es el mecanismo de lesión más común del escafoides?', opciones: ['Golpe directo', 'Caída sobre mano extendida', 'Torsión de muñeca', 'Compresión axial'], indiceRespuestaCorrecta: 1, explicacion: 'La caída sobre la mano extendida (FOOSH - Fall On OutStretched Hand) es el mecanismo más común de fractura de escafoides, especialmente en adultos jóvenes. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Media' },
    { id: 'ms_h_car_48', textoPregunta: '¿Qué hueso del carpo se ve afectado en la enfermedad de Kienböck?', opciones: ['Escafoides', 'Semilunar', 'Piramidal', 'Ganchoso'], indiceRespuestaCorrecta: 1, explicacion: 'La enfermedad de Kienböck es la necrosis avascular del semilunar, relacionada con su vascularización precaria y cargas repetitivas. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_49', textoPregunta: '¿Cuál es la secuela más temida de una fractura-luxación de escafoides mal tratada?', opciones: ['Rigidez', 'Pseudoartrosis', 'Artritis radiocarpiana', 'Colapso del carpo'], indiceRespuestaCorrecta: 3, explicacion: 'El colapso del carpo (SNAC - Scaphoid Non-union Advanced Collapse) es la secuela más grave, causando artritis progresiva y pérdida funcional severa. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
    { id: 'ms_h_car_50', textoPregunta: '¿Qué estructura limita el movimiento de flexión radiocarpiana?', opciones: ['Ligamento radiocarpiano palmar', 'Ligamento intercarpiano dorsal', 'Complejo fibrocartilaginoso triangular', 'Ligamento escafosemilunar'], indiceRespuestaCorrecta: 1, explicacion: 'Los ligamentos intercarpianos dorsales se tensan durante la flexión radiocarpiana, limitando este movimiento y proporcionando estabilidad. [CITA:gray]', tags: { regionId: 'miembro-superior', tema: 'Huesos', subtema: 'Huesos del carpo' }, dificultad: 'Difícil' },
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
		// XP acumulada requerida para alcanzar el nivel (curva más amable y progresiva)
		xp: level <= 1 ? 0 : Math.floor(150 * Math.pow(level - 1, 1.35)),
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
        action: { type: 'view', value: 'study' },
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