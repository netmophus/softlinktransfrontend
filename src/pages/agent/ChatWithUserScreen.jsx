import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  Paper,
  Badge,
  Avatar,
} from "@mui/material";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  setDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";


const ChatWithUserScreen = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [newMessages, setNewMessages] = useState({});
const [newUserPhone, setNewUserPhone] = useState("");
  useEffect(() => {
    const unsubscribers = clients.map((client) => {
      const convoId = `${client}_${user.phone}`;
      const convoRef = doc(db, "conversations", convoId);

      return onSnapshot(convoRef, (snapshot) => {
        if (snapshot.exists()) {
          const msgs = snapshot.data().messages || [];
          const last = msgs[msgs.length - 1];
          if (
            last &&
            last.sender === "user" &&
            client !== selectedClient
          ) {
            setNewMessages((prev) => ({ ...prev, [client]: true }));
          }
        }
      });
    });

    return () => unsubscribers.forEach((u) => u());
  }, [clients, selectedClient, user.phone]);

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     const querySnapshot = await getDocs(collection(db, "conversations"));
  //     const result = [];
  //     querySnapshot.forEach((snap) => {
  //       const data = snap.data();
  //       if (data.agentPhone === user.phone && data.userPhone) {
  //         result.push(data.userPhone);
  //       }
  //     });
  //     setClients(result);
  //   };

  //   fetchClients();
  // }, [user.phone]);


  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "conversations"), (snapshot) => {
    const result = [];
    snapshot.forEach((snap) => {
      const data = snap.data();
      if (data.agentPhone === user.phone && data.userPhone) {
        result.push(data.userPhone);
      }
    });
    setClients(result);
  });

  return () => unsubscribe(); // Nettoyage du listener
}, [user.phone]);


  useEffect(() => {
    if (!selectedClient) return;

    const convoId = `${selectedClient}_${user.phone}`;
    const convoRef = doc(db, "conversations", convoId);

    const unsubscribe = onSnapshot(convoRef, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedClient, user.phone]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const convoId = `${selectedClient}_${user.phone}`;
    const convoRef = doc(db, "conversations", convoId);

    const snap = await getDoc(convoRef);
    if (!snap.exists()) {
      await setDoc(convoRef, {
        userPhone: selectedClient,
        agentPhone: user.phone,
        messages: [],
      });
    }

    await updateDoc(convoRef, {
      messages: arrayUnion({
        sender: "agent",
        text,
        timestamp: new Date(),
      }),
    });

    setText("");
  };


  const startConversation = async () => {
  try {
    await api.post("/admin/start-conversation", {
      userPhone: newUserPhone,
    });
    setNewUserPhone("");
    alert("✅ Conversation démarrée !");
  } catch (err) {
    console.error("Erreur création conversation :", err);
  }
};

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: "#F4F7FE" }}>
      {/* Liste des clients */}
      <Box
        width="25%"
        sx={{
          borderRight: "1px solid #E0E0E0",
          backgroundColor: "#fff",
          overflowY: "auto",
          pt: 2,
        }}
      >
     <Typography variant="h6" sx={{ px: 2, pb: 1, color: "#1976D2", fontWeight: "bold" }}>
  📞 Clients
</Typography>

<Box display="flex" gap={1} px={2} pb={1}>
  <TextField
    size="small"
    fullWidth
    placeholder="Téléphone utilisateur"
    variant="outlined"
    value={newUserPhone}
    onChange={(e) => setNewUserPhone(e.target.value)}
  />
  <Button variant="contained" onClick={startConversation}>
    ➕
  </Button>
</Box>

<Divider />

        <Divider />
        <List>
          {clients.map((client) => (
            <ListItem
              button
              key={client}
              selected={client === selectedClient}
              onClick={() => {
                setSelectedClient(client);
                setNewMessages((prev) => ({ ...prev, [client]: false }));
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#E3F2FD",
                },
              }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!newMessages[client]}
                overlap="circular"
              >
                <Avatar sx={{ mr: 1, bgcolor: "#1976D2", fontSize: 14 }}>
                  {client.slice(-2)}
                </Avatar>
              </Badge>
              <ListItemText primary={client} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Zone de chat */}
      <Box flex={1} display="flex" flexDirection="column" p={3} sx={{mb:20}}>
        {selectedClient ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: "#0D47A1", fontWeight: "bold" }}>
              Conversation avec {selectedClient}
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: 2,
                mb: 2,
                overflowY: "auto",
                borderRadius: 3,
                backgroundColor: "#FAFAFA",
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  alignSelf={msg.sender === "agent" ? "flex-end" : "flex-start"}
                  sx={{
                    backgroundColor: msg.sender === "agent" ? "#BBDEFB" : "#E0E0E0",
                    color: "#000",
                    p: 1.2,
                    borderRadius: 2,
                    m: 0.5,
                    maxWidth: "70%",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </Box>
              ))}
            </Paper>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                placeholder="Écrire un message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={handleSend}
                sx={{ px: 4 }}
              >
                Envoyer
              </Button>
            </Box>
          </>
        ) : (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <Typography color="text.secondary">Sélectionnez un client pour démarrer une conversation.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWithUserScreen;
