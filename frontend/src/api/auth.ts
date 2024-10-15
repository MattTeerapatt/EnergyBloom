// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { email, password, type } = req.body;

//     try {
//       if (type === 'sign-in') {
//         const user = await fetch('http://localhost:3008/sign-in', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),
//             }).then((response) => response.json()
//         );  
//         return res.status(200).json({ user });
//       }

//       if (type === 'sign-up') {
//         const { first_name, last_name, address1, city, postal_code, date_of_birth } = req.body;
//         const user = await fetch('http://localhost:3008/sign-up', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ first_name, last_name, address1, city, postal_code, date_of_birth, email, password }),
//             }).then((response) => response.json()
//         );
//         return res.status(201).json({ user });
//       }
//     } catch (error) {
//       return res.status(400).json({ error: 'Something went wrong!' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
