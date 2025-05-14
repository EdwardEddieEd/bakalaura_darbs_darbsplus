import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

export function useAuth() {
    const { email, token, id } = useSelector((state) => state.user);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (id) {
            const db = getDatabase();
            const userRef = ref(db, `users/${id}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setRole(data.role || "user");
                }
            });
        }
    }, [id]);

    return {
        isAuth: !!email,
        email,
        token,
        id,
        role,
    }
}