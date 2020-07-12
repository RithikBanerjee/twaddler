using System;
using System.Linq;
using Twaddle.Models;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;

namespace Twaddle.Hubs
{
    public class MasterHub : Hub
    {
        private static List<Twaddler> Twaddlers = new List<Twaddler>();

        private static List<TwaddleDetails> Twaddles = new List<TwaddleDetails>();

        public void OnConnected(string TwaddlerName)
        {
            if (!Twaddlers.Any(x => Equals(x.ConnectionId, Context.ConnectionId)))
            {
                var twaddler = new Twaddler()
                {
                    Name = TwaddlerName,
                    ConnectionId = Context.ConnectionId
                };

                Twaddlers.Add(twaddler);
                Clients.Caller.LogIn(twaddler, Twaddlers, Twaddles);

                //broadcast the new twaddler to all twaddlers
                Clients.AllExcept(Context.ConnectionId).TwaddlerLogIn(twaddler);
            }
        }

        public override Task OnDisconnected()
        {
            var twaddler = Twaddlers.Find(x => Equals(x.ConnectionId, Context.ConnectionId));
            if (twaddler != null)
            {
                Twaddlers.Remove(twaddler);

                //broadcast the twaddler has loggedout to all twaddlers
                Clients.All.BoradcastTwaddlerLogOut(twaddler);
            }
            return base.OnDisconnected();
        }

        public void BroadcastTwaddle(TwaddleDetails twaddle)
        {
            Twaddles.Add(twaddle);
            //broadcast the new twaddle to all twaddlers
            Clients.All.BroadcastTwaddle(twaddle);
        }

        public void PrivateTwaddle(string reciverId, string message)
        {
            var reciver = Twaddlers.Find(x => Equals(x.ConnectionId, reciverId));
            if (reciver == null)
                return;

            var sender = Twaddlers.Find(x => Equals(x.ConnectionId, Context.ConnectionId));
            if (sender == null)
                return;

            var privateTwaddle = new TwaddleDetails()
            {
                Twaddler = sender.Name,
                TwaddleContent = message
            };

            Clients.Client(reciverId).PrivateTwaddle(sender.ConnectionId, privateTwaddle);
            Clients.Caller.PrivateTwaddle(reciver.ConnectionId, privateTwaddle);
        }
    }
}